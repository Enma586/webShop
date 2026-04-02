<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @page { margin: 0; size: letter; }
        body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            background-color: #ffffff; 
            color: #1f2937; 
            margin: 0; 
            padding: 60px 50px; 
            font-size: 11px; 
            line-height: 1.6;
        }
        .invoice-wrapper { height: 100%; position: relative; }
        .header-section { width: 100%; border-bottom: 4px solid #064e3b; padding-bottom: 30px; margin-bottom: 50px; }
        .company-name { font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #064e3b; }
        .invoice-title { font-size: 32px; font-weight: 100; color: #064e3b; text-transform: uppercase; text-align: right; opacity: 0.6; }
        .info-grid { width: 100%; margin-bottom: 60px; border-spacing: 0; }
        .section-label { font-size: 9px; text-transform: uppercase; color: #064e3b; font-weight: bold; border-left: 3px solid #064e3b; padding-left: 8px; margin-bottom: 10px; display: block; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
        .items-table th { background-color: #f0f4f3; color: #064e3b; text-align: left; padding: 15px 10px; font-size: 9px; text-transform: uppercase; border-bottom: 2px solid #064e3b; }
        .items-table td { padding: 18px 10px; border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }
        .totals-table { width: 45%; margin-left: auto; border-spacing: 0; }
        .totals-table td { padding: 10px 10px; }
        .grand-total-row td { background-color: #064e3b; color: #ffffff; padding: 22px 10px !important; }
        .footer-section { position: absolute; bottom: 0; width: 100%; text-align: center; color: #9ca3af; font-size: 9px; border-top: 1px solid #f3f4f6; padding-top: 25px; }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <table class="header-section" width="100%">
            <tr>
                <td>
                    <span class="company-name">PIBEs SHOP</span>
                    <p style="margin: 10px 0 0 0; color: #064e3b; font-size: 10px; font-weight: bold;">SISTEMA_CENTRAL // SV-SONSONATE</p>
                </td>
                <td class="invoice-title">Factura</td>
            </tr>
        </table>

        <table class="info-grid" width="100%">
            <tr>
                <td width="35%">
                    <span class="section-label">Identidad Cliente</span>
                    <strong style="font-size: 14px; color: #064e3b;">{{ $order->user->name }}</strong><br>
                    {{ $order->user->email }}<br>
                    TEL: {{ $order->address->phone ?? 'N/A' }}
                </td>
                <td width="35%">
                    <span class="section-label">Nodo de Entrega</span>
                    {{ $order->address->address_line ?? 'Entrega en Tienda' }}<br>
                    <strong>{{ $order->address->municipality->name ?? 'Sonsonate' }}, {{ $order->address->department->name ?? 'Sonsonate' }}</strong><br>
                    El Salvador, CA.
                </td>
                <td width="30%" class="text-right">
                    <span class="section-label" style="border-left: 0; border-right: 3px solid #064e3b; padding-right: 8px;">Metadata</span>
                    <strong>REF_ID:</strong> {{ $invoice->invoice_number }}<br>
                    <strong>EMISIÓN:</strong> {{ $invoice->created_at->format('d/m/Y') }}<br>
                    <strong>ORDEN:</strong> #{{ $order->order_number }}
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Recurso</th>
                    <th class="text-right">Cant.</th>
                    <th class="text-right">Unitario</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td><strong>{{ $item->product_name }}</strong></td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->price, 2) }}</td>
                    <td class="text-right">${{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals-table">
            <tr>
                <td class="text-right">Monto Gravado</td>
                <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right">Impuesto IVA (13%)</td>
                <td class="text-right">${{ number_format($invoice->tax, 2) }}</td>
            </tr>
            <tr class="grand-total-row">
                <td class="text-right"><strong>Total a Pagar</strong></td>
                <td class="text-right"><strong>${{ number_format($invoice->total, 2) }} USD</strong></td>
            </tr>
        </table>

        <div class="footer-section">
            <p>DOCUMENTO OFICIAL GENERADO POR SISTEMA CENTRAL PIBEs SHOP</p>
            <p>Sonsonate, El Salvador. Fecha: {{ date('d/m/Y') }}</p>
        </div>
    </div>
</body>
</html>