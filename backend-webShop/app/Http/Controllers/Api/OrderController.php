<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items', 'address.department', 'address.municipality'])->latest()->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function userOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items', 'invoice'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function show($id, Request $request)
    {
        $query = Order::with(['items', 'address.department', 'address.municipality', 'invoice']);

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $order = $query->find($id);

        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $order]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated to ' . $request->status,
            'data' => $order->load('invoice')
        ]);
    }
}