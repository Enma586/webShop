<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductHistory;
use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Http\Request;
use Exception;

class AdminController extends Controller
{
    public function getProductLogs()
    {
        try {
            $logs = ProductHistory::with(['product:id,name', 'user:id,username'])
                ->latest()
                ->paginate(30);

            return response()->json([
                'status' => 'success',
                'data' => $logs
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'FAILED_TO_SYNC_PRODUCT_LOGS'
            ], 500);
        }
    }

    public function getInventoryLogs()
    {
        try {
            $logs = InventoryLog::with(['product:id,name', 'user:id,username'])
                ->latest()
                ->paginate(30);

            return response()->json([
                'status' => 'success',
                'data' => $logs
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'FAILED_TO_SYNC_INVENTORY_LOGS'
            ], 500);
        }
    }

    public function getSystemStats()
    {
        try {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'recent_activities_count' => ProductHistory::where('created_at', '>=', now()->subDays(7))->count(),
                    'inventory_movements_today' => InventoryLog::whereDate('created_at', today())->count(),
                    'critical_stock' => Product::where('stock', '<=', 5)->count(),
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'STATS_RETRIEVAL_FAILED'], 500);
        }
    }
}