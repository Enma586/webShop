<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $cartItems = CartItem::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['status' => 'error', 'message' => 'Your cart is empty'], 400);
        }

        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'status' => 'error', 
                    'message' => "Insufficient stock for: {$item->product->name}"
                ], 422);
            }
        }

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        try {
            return DB::transaction(function () use ($user, $request, $cartItems, $total) {
                
                $order = Order::create([
                    'order_number'   => 'ORD-' . strtoupper(Str::random(8)),
                    'user_id'        => $user->id,
                    'address_id'     => $request->address_id,
                    'total'          => $total,
                    'status'         => 'pending',
                    'payment_method' => $request->payment_method ?? 'transfer',
                    'notes'          => $request->notes
                ]);

                foreach ($cartItems as $cartItem) {
                    $product = $cartItem->product;

                    OrderItem::create([
                        'order_id'     => $order->id,
                        'product_id'   => $product->id,
                        'product_name' => $product->name,
                        'quantity'     => $cartItem->quantity,
                        'price'        => $product->price 
                    ]);

                    $product->decrement('stock', $cartItem->quantity);

                    InventoryLog::create([
                        'product_id'    => $product->id,
                        'user_id'       => $user->id,
                        'movement_type' => 'sale',
                        'quantity'      => $cartItem->quantity,
                        'reason'        => "Order #{$order->order_number}"
                    ]);
                }

                CartItem::where('user_id', $user->id)->delete();

                return response()->json([
                    'status'  => 'success',
                    'message' => 'Purchase completed successfully!',
                    'order'   => [
                        'id' => $order->id,
                        'number' => $order->order_number
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Critical failure during checkout',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}