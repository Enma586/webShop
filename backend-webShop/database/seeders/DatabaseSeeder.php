<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Department;
use App\Models\Municipality;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Invoice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name'     => 'Enma Admin',
            'username' => 'enma_style',
            'email'    => 'admin@shop.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        $customer = User::create([
            'name'     => 'Juan Pérez',
            'username' => 'juan_perez',
            'email'    => 'juan@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'customer',
            'status'   => 'active',
        ]);

        $sonsonate = Department::create(['name' => 'Sonsonate']);
        $muniSonsonate = Municipality::create(['department_id' => $sonsonate->id, 'name' => 'Sonsonate Centro']);

        $address = Address::create([
            'user_id' => $customer->id,
            'department_id' => $sonsonate->id,
            'municipality_id' => $muniSonsonate->id,
            'address_line' => 'Colonia La Sensacional, Calle Principal #5',
            'phone' => '7788-9900',
            'is_default' => true,
        ]);

        $catMens = Category::create(['name' => 'Men\'s Wear', 'slug' => 'mens-wear']);
        
        $p1 = Product::create(['category_id' => $catMens->id, 'name' => 'Oversized Cotton Tee', 'slug' => 'oversized-cotton-tee', 'price' => 25.00, 'stock' => 50]);
        $p2 = Product::create(['category_id' => $catMens->id, 'name' => 'Cargo Pants', 'slug' => 'cargo-pants', 'price' => 35.00, 'stock' => 45]);

        $salesData = [
            ['num' => '001', 'days' => 40, 'total' => 200.00, 'prod' => $p1, 'qty' => 8],
            ['num' => '002', 'days' => 15, 'total' => 125.00, 'prod' => $p1, 'qty' => 5],
            ['num' => '003', 'days' => 9,  'total' => 70.00,  'prod' => $p2, 'qty' => 2],
            ['num' => '004', 'days' => 2,  'total' => 50.00,  'prod' => $p1, 'qty' => 2],
            ['num' => '005', 'days' => 0,  'total' => 105.00, 'prod' => $p2, 'qty' => 3],
        ];

        foreach ($salesData as $sale) {
            $date = Carbon::now()->subDays($sale['days']);

            $order = Order::create([
                'order_number' => "ORD-2026-{$sale['num']}",
                'user_id' => $customer->id,
                'address_id' => $address->id,
                'total' => $sale['total'],
                'status' => 'completed',
                'payment_method' => 'card',
                'created_at' => $date,
                'updated_at' => $date
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $sale['prod']->id,
                'product_name' => $sale['prod']->name,
                'quantity' => $sale['qty'],
                'price' => $sale['prod']->price,
                'created_at' => $date,
                'updated_at' => $date
            ]);

            Invoice::create([
                'invoice_number' => "INV-2026-{$sale['num']}",
                'order_id' => $order->id,
                'user_id' => $customer->id,
                'subtotal' => $sale['total'], 
                'tax' => 0.00, 
                'total' => $sale['total'],
                'status' => 'paid',
                'created_at' => $date,
                'updated_at' => $date
            ]);
        }
    }
}