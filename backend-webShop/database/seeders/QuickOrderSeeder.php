<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Invoice;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class QuickOrderSeeder extends Seeder
{
public function run(): void
{
    $customer = User::where('role', 'customer')->first();
    $product = Product::where('slug', 'oversized-cotton-tee')->first();
    $qty = 5; 
    $total = $product->price * $qty;

    // Al crear este registro, el Observer hará su magia solo
    $order = Order::create([
        'order_number' => "ORD-AUTO-" . time(),
        'user_id' => $customer->id,
        'address_id' => Address::where('user_id', $customer->id)->first()->id,
        'total' => $total,
        'status' => 'completed',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => $qty, // El Observer lee este valor
        'price' => $product->price,
    ]);

    Invoice::create([
        'invoice_number' => "INV-AUTO-" . time(),
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'subtotal' => $total, 
        'tax' => 0.00, 
        'total' => $total,
        'status' => 'paid',
    ]);

    $this->command->info("Orden creada. El Observer debería haber bajado exactamente 5.");
}
}