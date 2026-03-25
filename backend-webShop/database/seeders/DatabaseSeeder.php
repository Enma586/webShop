<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Enma Admin',
            'username' => 'enma_style',
            'email'    => 'admin@shop.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        $men = Category::create([
            'name' => 'Men\'s Wear',
            'slug' => 'mens-wear',
            'description' => 'Latest trends in male fashion',
        ]);

        $women = Category::create([
            'name' => 'Women\'s Collection',
            'slug' => 'womens-collection',
            'description' => 'Elegant and casual clothing for women',
        ]);

        $acc = Category::create([
            'name' => 'Accessories',
            'slug' => 'accessories',
            'description' => 'Bags, belts, and jewelry',
        ]);

        Product::create([
            'category_id' => $men->id,
            'name'        => 'Oversized Cotton Tee',
            'slug'        => 'oversized-cotton-tee-black',
            'description' => '100% heavy cotton, drop shoulder fit in Midnight Black.',
            'price'       => 29.99,
            'stock'       => 50,
            'image'       => null,
        ]);

        Product::create([
            'category_id' => $men->id,
            'name'        => 'Slim Fit Chino Pants',
            'slug'        => 'slim-fit-chinos-khaki',
            'description' => 'Classic khaki chinos with stretch fabric for comfort.',
            'price'       => 45.00,
            'stock'       => 30,
            'image'       => null,
        ]);

        Product::create([
            'category_id' => $women->id,
            'name'        => 'Silk Evening Dress',
            'slug'        => 'silk-evening-dress-red',
            'description' => 'Premium silk dress with a minimalist aesthetic.',
            'price'       => 120.00,
            'stock'       => 12,
            'image'       => null,
        ]);

        Product::create([
            'category_id' => $women->id,
            'name'        => 'High-Waist Denim',
            'slug'        => 'high-waist-denim-blue',
            'description' => 'Vintage wash high-waist jeans, straight leg cut.',
            'price'       => 55.50,
            'stock'       => 25,
            'image'       => null,
        ]);

        Product::create([
            'category_id' => $acc->id,
            'name'        => 'Leather Minimalist Wallet',
            'slug'        => 'leather-wallet-tan',
            'description' => 'Genuine leather card holder with RFID protection.',
            'price'       => 19.99,
            'stock'       => 100,
            'image'       => null,
        ]);

        Product::create([
            'category_id' => $acc->id,
            'name'        => 'Retro Sunglasses',
            'slug'        => 'retro-sunglasses-gold',
            'description' => 'Gold-rimmed aviator style with polarized lenses.',
            'price'       => 35.00,
            'stock'       => 0,
            'image'       => null,
        ]);

        User::create([
            'name'     => 'Usuario Mal portado',
            'username' => 'el_baneado',
            'email'    => 'bad@user.com',
            'password' => Hash::make('password123'),
            'role'     => 'customer',
            'status'   => 'banned', // <--- Aquí la clave
        ]);
    }
}
