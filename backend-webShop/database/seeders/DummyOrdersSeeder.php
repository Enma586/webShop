<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DummyOrdersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtener clientes que tengan al menos una dirección
        $customers = User::where('role', 'customer')->has('addresses')->get();
        // 2. Obtener productos con stock suficiente para no quebrar el inventario
        $products = Product::where('stock', '>', 10)->get();

        if ($customers->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Aviso: Necesitas clientes (con dirección) y productos con stock para correr este seeder.');
            return;
        }

        $statuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
        $paymentMethods = ['transfer', 'card', 'cash'];

        $this->command->info('Iniciando simulación: Generando 20 órdenes históricas...');

        for ($i = 0; $i < 20; $i++) {
            $customer = $customers->random();
            $address = $customer->addresses->random();

            // Fechas aleatorias de los últimos 90 días para poblar gráficas
            $randomDate = Carbon::now()->subDays(rand(1, 90))->subHours(rand(1, 24));

            // 3. Crear la Orden Base
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'user_id' => $customer->id,
                'address_id' => $address->id,
                'total' => 0, // Se calculará sumando los items
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'status' => $statuses[array_rand($statuses)],
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ]);

            $orderTotal = 0;
            // Cada orden tendrá entre 1 y 4 productos diferentes
            $numItems = rand(1, 4);
            $selectedProducts = $products->random($numItems);

            foreach ($selectedProducts as $product) {
                $qty = rand(1, 3);
                
                // 4. Crear el Item de la orden (¡Aquí se dispara tu OrderItemObserver!)
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                     'product_name' => $product->name, 
                    'quantity' => $qty,
                    'price' => $product->price,
                    'created_at' => $randomDate,
                    'updated_at' => $randomDate,
                ]);

                $orderTotal += ($product->price * $qty);
            }

            // 5. Actualizar el total real de la orden
            $order->update(['total' => $orderTotal]);

            // 6. Generar su Factura (Invoice)
            $subtotal = $orderTotal * 0.87;
            $tax = $orderTotal * 0.13;

            Invoice::create([
                'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
                'user_id' => $customer->id,
                'order_id' => $order->id,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $orderTotal,
                'status' => $order->status === 'cancelled' ? 'cancelled' : 'paid',
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ]);
        }

        $this->command->info('¡Misión cumplida! 20 órdenes generadas. El Observer ya debió descontar los stocks e insertar los logs.');
    }
}