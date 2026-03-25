<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * ADMIN: List all orders in the system
     */
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])->latest()->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * CUSTOMER: List only orders belonging to the authenticated user
     */
    public function userOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * CUSTOMER: View specific order details if they own it
     */
    public function showUserOrder(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with('items.product', 'address')
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $order]);
    }

    /**
     * ADMIN: Update Order Status (Shipped, Delivered, Canceled, etc.)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,shipped,delivered,canceled'
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated to ' . $request->status
        ]);
    }
}