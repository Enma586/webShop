<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Invoice;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class OrderObserver
{
    public function updated(Order $order): void
    {
        if ($order->isDirty('status') && $order->status === 'completed' && !$order->invoice) {
            
            $total = $order->total;
            $taxRate = 0.13;
            $subtotal = $total / (1 + $taxRate);
            $tax = $total - $subtotal;

            $invoice = Invoice::create([
                'invoice_number' => 'FAC-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'order_id'       => $order->id,
                'user_id'        => $order->user_id,
                'subtotal'       => round($subtotal, 2),
                'tax'            => round($tax, 2),
                'total'          => $total,
                'status'         => 'paid', 
            ]);

            $order->load(['items', 'user', 'address.department', 'address.municipality']);

            $pdf = Pdf::loadView('pdf.invoice', [
                'order' => $order,
                'invoice' => $invoice
            ]);

            $fileName = "invoice_{$invoice->invoice_number}.pdf";
            Storage::put("public/invoices/{$fileName}", $pdf->output());
        }
    }
}