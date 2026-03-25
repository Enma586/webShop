<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\ProductHistory;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\Auth;

class ProductObserver
{
    /**
     * Safely retrieve the authenticated administrator ID.
     * Defaults to System ID (1) if Auth fails or during CLI operations (seeding/tasks).
     */
    private function getAdminId()
    {
        return Auth::id() ?? 1; 
    }

    /**
     * Handle the Product "created" event.
     * Initializes history tracking and performs the first inventory injection.
     */
    public function created(Product $product)
    {
        $adminId = $this->getAdminId();

        // Register initial price and state in History
        ProductHistory::create([
            'product_id' => $product->id,
            'user_id'    => $adminId,
            'old_price'  => 0,
            'new_price'  => $product->price,
            'action'     => 'CREATE_SEQUENCE', 
            'slug'       => $product->slug
        ]);

        // Register initial stock levels in Inventory Logs
        InventoryLog::create([
            'product_id'    => $product->id,
            'user_id'       => $adminId,
            'movement_type' => 'in',
            'quantity'      => $product->stock,
            'reason'        => 'INITIAL_STOCK_INJECTION'
        ]);
    }

    /**
     * Handle the Product "updated" event.
     * Monitors sensitive data changes (price/slug) and stock fluctuations.
     */
    public function updated(Product $product)
    {
        $adminId = $this->getAdminId();

        // 1. Metadata & Pricing Monitor
        if ($product->isDirty(['price', 'slug'])) {
            ProductHistory::create([
                'product_id' => $product->id,
                'user_id'    => $adminId,
                'old_price'  => $product->getOriginal('price'),
                'new_price'  => $product->price,
                'old_data'   => [ 
                    'old_slug'  => $product->getOriginal('slug'),
                    'new_slug'  => $product->slug,
                    'timestamp' => now()->toDateTimeString()
                ],
                'action'     => 'DATA_PATCH_EXECUTED',
                'slug'       => $product->slug
            ]);
        }

        // 2. Inventory Delta Monitor
        if ($product->isDirty('stock')) {
            $oldStock = $product->getOriginal('stock');
            $newStock = $product->stock;
            $diff     = $newStock - $oldStock;

            if ($diff != 0) {
                InventoryLog::create([
                    'product_id'    => $product->id,
                    'user_id'       => $adminId,
                    'movement_type' => $diff > 0 ? 'in' : 'out',
                    'quantity'      => abs($diff),
                    'reason'        => 'MANUAL_DELTA_ADJUSTMENT'
                ]);
            }
        }
    }

    /**
     * Handle the Product "deleting" event.
     * Captures a "Black Box" snapshot of the data before final purge.
     */
    public function deleting(Product $product)
    {
        $adminId = $this->getAdminId();

        // Preserve final state before record destruction
        ProductHistory::create([
            'product_id' => $product->id,
            'user_id'    => $adminId,
            'old_price'  => $product->price,
            'new_price'  => 0,
            'old_data'   => $product->toArray(), 
            'action'     => 'PURGE_SEQUENCE_COMPLETE',
            'slug'       => $product->slug
        ]);

        // Finalize inventory decommissioning
        InventoryLog::create([
            'product_id'    => $product->id,
            'user_id'       => $adminId,
            'movement_type' => 'out',
            'quantity'      => $product->stock,
            'reason'        => 'ASSET_DECOMMISSIONED'
        ]);
    }
}