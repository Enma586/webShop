<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['user', 'order.items'])->latest()->get();
        return response()->json(['status' => 'success', 'data' => $invoices]);
    }

    public function userInvoices(Request $request)
    {
        $invoices = Invoice::where('user_id', $request->user()->id)
            ->with(['order.items'])
            ->latest()
            ->get();

        return response()->json(['status' => 'success', 'data' => $invoices]);
    }

    public function show($id, Request $request)
    {
        $invoice = Invoice::with(['user', 'order.items', 'order.address.department', 'order.address.municipality'])
            ->findOrFail($id);

        if ($request->user()->role !== 'admin' && $invoice->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $invoice]);
    }

    public function printInvoice(Request $request, $orderId)
    {
        $invoice = Invoice::where('order_id', $orderId)->first();

        if (!$invoice) {
            return response()->json(['error' => 'DATABASE_RECORD_NOT_FOUND'], 404);
        }

        // SEGURIDAD: Si no es admin, validar que la factura le pertenezca
        if ($request->user()->role !== 'admin' && $invoice->user_id !== $request->user()->id) {
            return response()->json(['error' => 'UNAUTHORIZED_ACCESS'], 403);
        }

        $fileName = "invoices/invoice_{$invoice->invoice_number}.pdf";
        $disk = Storage::disk('public');

        if (!$disk->exists($fileName)) {
            $order = Order::with(['items', 'user', 'address.department', 'address.municipality'])->find($orderId);
            
            if (!$order) {
                return response()->json(['error' => 'ORDER_NOT_FOUND'], 404);
            }

            $pdf = Pdf::loadView('pdf.invoice', compact('order', 'invoice'));
            $disk->put($fileName, $pdf->output());
        }

        return response()->file($disk->path($fileName), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline'
        ]);
    }
}