<?php

namespace App\Observers;

use App\Models\OrderItem;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\Auth;

class OrderItemObserver
{
    /**
     * Handle the OrderItem "created" event.
     * Triggered after a product is successfully saved into an order.
     */
    public function created(OrderItem $orderItem): void
    {
        // 1. Get the related product and determine the responsible user
        $product = $orderItem->product;
        
        /** * Validation: Use the currently authenticated user (Admin/Customer), 
         * or fallback to the order owner if no session is detected.
         */
        $responsibleId = Auth::id() ?? $orderItem->order->user_id;

        if ($product) {
            // 2. Substract the quantity sold from the product's stock
            $product->decrement('stock', $orderItem->quantity);

            // 3. Register the inventory movement with validated user_id
            InventoryLog::create([
                'product_id'    => $product->id,
                'user_id'       => $responsibleId,
                'movement_type' => 'out', // Output of merchandise
                'quantity'      => $orderItem->quantity,
                'reason'        => "Automatic sale - Order #{$orderItem->order_id}",
            ]);
        }
    }
}