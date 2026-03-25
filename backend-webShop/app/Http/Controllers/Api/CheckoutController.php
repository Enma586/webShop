<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Http\Requests\CheckoutRequest;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(CheckoutRequest $request)
    {
        $user = $request->user();

        // 1. Search for the user's cart items with product details (price, stock)
        $cartItems = CartItem::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'No puedes comprar con un carrito vacío'], 400);
        }

        // 2. We Calculate the total price of the order (sum of price * quantity)
        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        // 3. Start a DB transaction to ensure data integrity
        try {
            return DB::transaction(function () use ($user, $request, $cartItems, $total) {
                
        
                $order = Order::create([
                    'user_id'    => $user->id,
                    'address_id' => $request->address_id,
                    'total'      => $total,
                    'status'     => 'paid' 
                ]);

                
                foreach ($cartItems as $cartItem) {
                    OrderItem::create([
                        'order_id'   => $order->id,
                        'product_id' => $cartItem->product_id,
                        'quantity'   => $cartItem->quantity,
                        'unit_price' => $cartItem->product->price 
                    ]);
                    
         
                }

              
                CartItem::where('user_id', $user->id)->delete();

                return response()->json([
                    'status'  => 'success',
                    'message' => '¡Compra realizada con éxito!',
                    'order'   => $order->id
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Fallo crítico al procesar la orden',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}