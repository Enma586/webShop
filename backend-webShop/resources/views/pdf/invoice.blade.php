<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @page { margin: 0; size: letter; }
        body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            background-color: #ffffff; 
            color: #1f2937; 
            margin: 0; 
            padding: 60px 50px; 
            font-size: 11px; 
            line-height: 1.6;
        }
        .invoice-wrapper { height: 100%; position: relative; }
        
        /* Verde Primary: #064e3b */
        .header-section { width: 100%; border-bottom: 4px solid #064e3b; padding-bottom: 30px; margin-bottom: 50px; }
        .company-name { font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #064e3b; }
        .invoice-title { font-size: 32px; font-weight: 100; color: #064e3b; text-transform: uppercase; text-align: right; opacity: 0.6; }

        .info-grid { width: 100%; margin-bottom: 60px; border-spacing: 0; }
        .info-grid td { vertical-align: top; }
        .section-label { font-size: 9px; text-transform: uppercase; color: #064e3b; font-weight: bold; border-left: 3px solid #064e3b; padding-left: 8px; letter-spacing: 1.5px; display: block; margin-bottom: 10px; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
        .items-table th { background-color: #f0f4f3; color: #064e3b; text-align: left; padding: 15px 10px; font-size: 9px; text-transform: uppercase; border-bottom: 2px solid #064e3b; }
        .items-table td { padding: 18px 10px; border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }

        .grand-total-section { width: 100%; margin-top: 40px; }
        .totals-table { width: 45%; margin-left: auto; border-spacing: 0; }
        .totals-table td { padding: 10px 10px; }
        .totals-table .total-label { color: #6b7280; font-size: 10px; text-transform: uppercase; }
        .totals-table .total-value { font-weight: bold; color: #064e3b; font-size: 13px; }
        
        .grand-total-row td { background-color: #064e3b; color: #ffffff; padding: 22px 10px !important; }
        .grand-total-row .total-value { font-size: 20px !important; color: #ffffff; }

        .footer-section { 
            position: absolute; 
            bottom: 0; 
            width: 100%; 
            text-align: center; 
            color: #9ca3af; 
            font-size: 9px; 
            border-top: 1px solid #f3f4f6; 
            padding-top: 25px; 
        }
        .sku-tag { color: #064e3b; font-size: 8px; font-weight: bold; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <table class="header-section">
            <tr>
                <td>
                    <span class="company-name">{{ env('APP_NAME', 'WEB_SHOP') }}</span>
                    <p style="margin: 10px 0 0 0; color: #064e3b; font-size: 10px; font-weight: bold; letter-spacing: 1px;">SISTEMA_CENTRAL // <span style="font-weight: normal;">SV-SONSONATE</span></p>
                </td>
                <td class="invoice-title">Factura</td>
            </tr>
        </table>

        <table class="info-grid">
            <tr>
                <td width="35%">
                    <span class="section-label">Identidad Cliente</span>
                    <strong style="font-size: 14px; color: #064e3b;">{{ $order->user->name }}</strong><br>
                    <span style="color: #374151;">{{ $order->user->email }}</span><br>
                    {{-- Usamos el teléfono de la dirección o el del perfil si no hay dirección --}}
                    <span style="color: #374151;">TEL: {{ $order->address->phone ?? 'N/A' }}</span>
                </td>
                <td width="35%">
                    <span class="section-label">Nodo de Entrega</span>
                    <span style="color: #374151;">
                        @if($order->address)
                            {{-- Caso 1: El usuario seleccionó una dirección guardada --}}
                            {{ $order->address->address_line }}<br>
                            <strong>{{ $order->address->municipality->name }}, {{ $order->address->department->name }}</strong><br>
                        @else
                            {{-- Caso 2: Manual Override (Dirección escrita a mano en el Checkout) --}}
                            <strong>ENVÍO MANUAL:</strong><br>
                            {{ $order->notes ?? 'DIRECCIÓN NO ESPECIFICADA' }}<br>
                        @endif
                        El Salvador, CA.
                    </span>
                </td>
                <td width="30%" class="text-right">
                    <span class="section-label" style="border-left: 0; border-right: 3px solid #064e3b; padding-right: 8px;">Metadata</span>
                    <strong>REF_ID:</strong> <span style="color: #064e3b; font-weight: bold;">{{ $invoice->invoice_number }}</span><br>
                    <strong>EMISIÓN:</strong> {{ $invoice->created_at->timezone('America/El_Salvador')->format('d/m/Y h:i A') }}<br>
                    <strong>TIPO:</strong> Digital_Document
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th width="50%">Descripción del Recurso</th>
                    <th width="15%" class="text-right">Cant.</th>
                    <th width="15%" class="text-right">P. Unitario</th>
                    <th width="20%" class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <strong style="color: #064e3b; font-size: 12px;">{{ $item->product_name }}</strong>
                        <br><span class="sku-tag">SKU-{{ strtoupper(Str::slug($item->product_name)) }}</span>
                    </td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->price, 2) }}</td>
                    <td class="text-right">${{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="grand-total-section">
            <table class="totals-table">
                <tr>
                    <td class="total-label text-right">Monto Gravado</td>
                    <td class="total-value text-right">${{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td class="total-label text-right">Impuesto IVA (13%)</td>
                    <td class="total-value text-right">${{ number_format($invoice->tax, 2) }}</td>
                </tr>
                <tr class="grand-total-row">
                    <td class="total-label text-right" style="color: #ffffff; font-weight: bold;">Total a Pagar</td>
                    <td class="total-value text-right" style="color: #ffffff;">${{ number_format($invoice->total, 2) }} USD</td>
                </tr>
            </table>
        </div>

        <div class="footer-section">
            <p style="margin-bottom: 5px; color: #064e3b; font-weight: bold;">DOCUMENTO OFICIAL GENERADO POR {{ env('APP_NAME') }}</p>
            <p>Sonsonate, El Salvador. Timestamp: {{ date('d/m/Y h:i A') }}</p>
            <p style="margin-top: 5px; color: #064e3b; opacity: 0.7;">Gracias por su preferencia.</p>
        </div>
    </div>
</body>
</html>