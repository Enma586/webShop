<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
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
    
        if (!$request->has('items') || count($request->items) === 0) {
            return response()->json(['status' => 'error', 'message' => 'No assets found in manifest'], 400);
        }

        $items = $request->items; 

     
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product->stock < $item['quantity']) {
                $name = $product ? $product->name : "Unknown Item";
                return response()->json([
                    'status' => 'error', 
                    'message' => "Insufficient stock for: {$name}"
                ], 422);
            }
        }

        try {
            return DB::transaction(function () use ($user, $request, $items) {
                
        
                $order = Order::create([
                    'order_number'   => 'ORD-' . strtoupper(Str::random(8)),
                    'user_id'        => $user->id,
                    'address_id'     => $request->address_id ?? null, 
                    'total'          => $request->total,
                    'status'         => 'pending',
                    'payment_method' => $request->payment_method ?? 'transfer',
                    'notes'          => "Phone: {$request->phone} | Addr: {$request->address} | Notes: {$request->notes}"
                ]);
                foreach ($items as $itemData) {
                    $product = Product::find($itemData['product_id']);

                    OrderItem::create([
                        'order_id'     => $order->id,
                        'product_id'   => $product->id,
                        'product_name' => $product->name,
                        'quantity'     => $itemData['quantity'],
                        'price'        => $product->price 
                    ]);
                    $product->decrement('stock', $itemData['quantity']);

                    InventoryLog::create([
                        'product_id'    => $product->id,
                        'user_id'       => $user->id,
                        'movement_type' => 'sale',
                        'quantity'      => $itemData['quantity'],
                        'reason'        => "Order #{$order->order_number}"
                    ]);
                }

                return response()->json([
                    'status'  => 'success',
                    'message' => 'PURCHASE COMPLETED SUCCESSFULLY!',
                    'order'   => [
                        'id' => $order->id,
                        'number' => $order->order_number
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'CRITICAL SYSTEM FAILURE',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}