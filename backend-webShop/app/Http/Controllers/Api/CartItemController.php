<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        
        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $cartItem->load('product')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $cartItem = CartItem::where('user_id', $request->user()->id)->findOrFail($id);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'status' => 'success',
            'data' => $cartItem->load('product')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)->find($id);

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['status' => 'success', 'message' => 'Item removed']);
    }

    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();
        return response()->json(['status' => 'success', 'message' => 'Cart cleared']);
    }
}