<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice_{{ $invoice->invoice_number }}</title>
    <style>
        @page { margin: 0; size: letter; }
        body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            background-color: #ffffff; 
            color: #1f2937; 
            margin: 0; 
            padding: 30px; 
            font-size: 10px; 
            line-height: 1.5;
        }
        /* Borde exterior doble */
        .main-border {
            border: 3px double #064e3b;
            padding: 20px;
            height: 940px; /* Ajuste para asegurar que el borde cierre bien en carta */
            position: relative;
        }
        .header-section { 
            width: 100%; 
            border: 1px solid #064e3b; /* Borde simple en cabecera */
            padding: 15px;
            margin-bottom: 20px; 
        }
        .company-name { font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #064e3b; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #064e3b; text-transform: uppercase; text-align: right; }
        
        /* Contenedor de info con bordes tipo rejilla */
        .info-container {
            width: 100%;
            border: 1px solid #064e3b;
            margin-bottom: 20px;
            border-spacing: 0;
        }
        .info-container td {
            padding: 12px;
            border-right: 1px solid #064e3b;
            vertical-align: top;
        }
        .info-container td:last-child { border-right: 0; }

        .section-label { 
            font-size: 8px; 
            text-transform: uppercase; 
            color: #ffffff; 
            background-color: #064e3b; /* Fondo sólido para labels */
            font-weight: bold; 
            display: inline-block; 
            padding: 2px 6px;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }

        /* Tabla de items con bordes en cada celda */
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
            border: 1px solid #064e3b; 
        }
        .items-table th { 
            background-color: #064e3b; 
            color: #ffffff; 
            text-align: left; 
            padding: 10px; 
            font-size: 8px; 
            text-transform: uppercase;
            border: 1px solid #ffffff; 
        }
        .items-table td { 
            padding: 10px; 
            border: 1px solid #064e3b; 
        }
        .text-right { text-align: right; }

        /* Sección de totales con borde grueso */
        .totals-wrapper {
            width: 100%;
        }
        .totals-table { 
            width: 40%; 
            margin-left: auto; 
            border-collapse: collapse; 
            border: 2px solid #064e3b; 
        }
        .totals-table td { 
            padding: 8px 10px; 
            border: 1px solid #064e3b; 
        }
        .grand-total-row td { 
            background-color: #f0f4f3; 
            color: #064e3b; 
            font-weight: bold; 
        }

        .footer-section { 
            position: absolute; 
            bottom: 20px; 
            left: 20px;
            right: 20px;
            text-align: center; 
            color: #9ca3af; 
            font-size: 8px; 
            text-transform: uppercase;
            border-top: 1px dashed #064e3b;
            padding-top: 15px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border: 1px solid #064e3b;
            color: #064e3b;
            font-weight: bold;
            margin-top: 5px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="main-border">
        <table class="header-section">
            <tr>
                <td>
                    <span class="company-name">PIBEs SHOP</span>
                    <p style="margin: 5px 0; color: #064e3b; font-weight: bold; letter-spacing: 1px;">
                        ESTADO_CENTRAL // Sonsonate, SV
                    </p>
                    <div class="status-badge">STATUS: {{ strtoupper($invoice->status) }}</div>
                </td>
                <td class="invoice-title">
                    FACTURA DIGITAL<br>
                    <span style="font-size: 12px; font-weight: normal;">ID_TRANSACCIÓN: #{{ $invoice->invoice_number }}</span>
                </td>
            </tr>
        </table>

        <table class="info-container">
            <tr>
                <td width="33%">
                    <span class="section-label">01 // CLIENTE</span><br>
                    <strong style="font-size: 11px;">{{ $order->user->name }}</strong><br>
                    {{ $order->user->email }}<br>
                    TEL: {{ $order->address->phone ?? 'N/A' }}
                </td>
                <td width="33%">
                    <span class="section-label">02 // LOGÍSTICA</span><br>
                    {{ $order->address->address_line ?? 'RECOGER EN TIENDA' }}<br>
                    <strong>
                        {{ $order->address->district->name ?? 'DISTRITO_N' }}, 
                        {{ $order->address->municipality->name ?? 'MUNICIPIO_N' }}
                    </strong><br>
                    {{ $order->address->department->name ?? 'SONSONATE' }}, SV.
                </td>
                <td width="34%">
                    <span class="section-label">03 // METADATOS</span><br>
                    <strong>ORDEN:</strong> #{{ $order->order_number }}<br>
                    <strong>FECHA:</strong> {{ $invoice->created_at->format('d/m/Y H:i') }}<br>
                    <strong>PAGO:</strong> {{ strtoupper($order->payment_method ?? 'TRANSFERENCIA') }}
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción del Producto / Recurso</th>
                    <th class="text-right" width="60">Cantidad</th>
                    <th class="text-right" width="100">P. Unitario</th>
                    <th class="text-right" width="100">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td><span style="font-weight: bold;">{{ $item->product_name }}</span></td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->price, 2) }}</td>
                    <td class="text-right">${{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-wrapper">
            <table class="totals-table">
                <tr>
                    <td class="text-right" style="font-size: 8px;">MONTO_NETO</td>
                    <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td class="text-right" style="font-size: 8px;">IVA_RETENIDO (13%)</td>
                    <td class="text-right">${{ number_format($invoice->tax, 2) }}</td>
                </tr>
                <tr class="grand-total-row">
                    <td class="text-right">TOTAL_FINAL_USD</td>
                    <td class="text-right"><strong>${{ number_format($invoice->total, 2) }}</strong></td>
                </tr>
            </table>
        </div>

        <div class="footer-section">
            <p style="letter-spacing: 2px; font-weight: bold; color: #064e3b;">*** CERTIFICADO DE OPERACIÓN ELECTRÓNICA ***</p>
            <p>Este documento es un comprobante oficial generado por el sistema PIBEs SHOP.</p>
            <p>Sonsonate, El Salvador &bull; {{ date('Y') }} &bull; Protocolo v3.0</p>
        </div>
    </div>
</body>
</html>