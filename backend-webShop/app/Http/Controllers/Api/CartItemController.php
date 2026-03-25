<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Http\Requests\StoreCartRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartItemController extends Controller
{

    public function index(Request $request)
    {
       
        $cart = CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $cart
        ], 200);
    }


    public function store(StoreCartRequest $request)
    {
        $user = $request->user();

        
        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => $user->id, 
                'product_id' => $request->product_id
            ],
            [
         
                'quantity' => DB::raw("quantity + {$request->quantity}")
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Producto añadido al carrito',
            'data' => $cartItem->load('product')
        ], 201);
    }

   
    public function destroy(Request $request, $id)
    {
       
        $cartItem = CartItem::where('user_id', $request->user()->id)->find($id);

        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'El producto no existe en tu carrito'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Producto eliminado del carrito'
        ], 200);
    }
}