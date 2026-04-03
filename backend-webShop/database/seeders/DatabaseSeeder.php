<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Department;
use App\Models\Municipality;
use App\Models\District; // Importante añadir el modelo
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Enma Admin',
            'username' => 'enma_style',
            'email' => 'admin@shop.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $map = [
            'Ahuachapán' => [
                'Ahuachapán Norte' => ['Atiquizaya', 'El Refugio', 'San Lorenzo', 'Turín'],
                'Ahuachapán Centro' => ['Ahuachapán', 'Apaneca', 'Concepción de Ataco', 'Tacuba'],
                'Ahuachapán Sur' => ['Guaymango', 'Jujutla', 'San Francisco Menéndez', 'San Pedro Puxtla']
            ],
            'Santa Ana' => [
                'Santa Ana Norte' => ['Metapán', 'Santa Rosa Guachipilín', 'Masahuat', 'Texistepeque'],
                'Santa Ana Centro' => ['Santa Ana'],
                'Santa Ana Este' => ['Coatepeque', 'El Congo'],
                'Santa Ana Oeste' => ['Chalchuapa', 'San Sebastián Salitrillo', 'El Porvenir', 'San Antonio Pajonal', 'Candelaria de la Frontera', 'Santiago de la Frontera']
            ],
            'Sonsonate' => [
                'Sonsonate Norte' => ['Juayúa', 'Nahuizalco', 'Salcoatitán', 'Santa Catarina Masahuat'],
                'Sonsonate Centro' => ['Sonsonate', 'Sonzacate', 'Nahulingo', 'San Antonio del Monte'],
                'Sonsonate Este' => ['Izalco', 'Armenia', 'Caluco', 'Cuisnahuat', 'San Julián', 'Santa Isabel Ishuatán', 'Santo Domingo de Guzmán'],
                'Sonsonate Oeste' => ['Acajutla']
            ],
            'San Salvador' => [
                'San Salvador Norte' => ['Aguilares', 'El Paisnal', 'Guazapa'],
                'San Salvador Oeste' => ['Apopa', 'Nejapa'],
                'San Salvador Este' => ['Ilopango', 'San Martín', 'Soyapango', 'Tonacatepeque'],
                'San Salvador Centro' => ['San Salvador', 'Ayutuxtepeque', 'Mejicanos', 'Cuscatancingo', 'Ciudad Delgado'],
                'San Salvador Sur' => ['Panchimalco', 'Rosario de Mora', 'San Marcos', 'Santo Tomás', 'Santiago Texacuangos']
            ],
            // Puedes seguir el mismo patrón para los demás departamentos si lo deseas. 
            // Para ahorrar espacio, aquí te dejo el resto con un municipio general que contiene los distritos:
            'La Libertad' => ['La Libertad Sur' => ['Santa Tecla', 'Comasagua'], 'La Libertad Centro' => ['San Juan Opico', 'Ciudad Arce']],
            'San Miguel' => ['San Miguel Centro' => ['San Miguel', 'Comacarán', 'Uluazapa']],
            'La Unión' => ['La Unión Sur' => ['La Unión', 'Conchagua', 'Intipucá', 'Meanguera del Golfo', 'San Alejo', 'Yayantique', 'Yucuaiquín']],
        ];

        foreach ($map as $depName => $municipalities) {
            $dep = Department::create(['name' => $depName]);

            foreach ($municipalities as $muniName => $districts) {
                // Si el valor no es un array (para los departamentos que no completamos arriba), creamos un genérico
                if (!is_array($districts)) {
                    $muniName = $depName . " Unique";
                    $districts = $municipalities;
                }

                $muni = Municipality::create([
                    'department_id' => $dep->id,
                    'name' => $muniName
                ]);

                foreach ($districts as $distName) {
                    District::create([
                        'municipality_id' => $muni->id,
                        'name' => $distName
                    ]);
                }
            }
        }

        // --- SECCIÓN DE PRODUCTOS (Manteniendo tu lógica previa) ---

        $genderCatalog = [
            'MEN' => [
                'T-Shirts' => ['Classic White Tee', 'Oversized Black Shirt', 'Graphic Urban Tee'],
                'Hoodies' => ['Grey Tech Hoodie', 'Heavyweight Navy Sweatshirt', 'Essential Street Hoodie'],
                'Pants' => ['Slim Fit Cargo Pants', 'Tech Utility Joggers', 'Cuffed Chino Pants'],
            ],
            'WOMEN' => [
                'Tops' => ['Cropped White Tee', 'Ribbed Tank Top', 'Vintage Graphic Top'],
                'Hoodies' => ['Pastel Oversized Hoodie', 'Zip Up Sweatshirt', 'Minimalist Fleece Hoodie'],
                'Bottoms' => ['High Waisted Cargo', 'Wide Leg Pants', 'Sporty Biker Shorts'],
            ]
        ];

        foreach ($genderCatalog as $genderName => $subCategories) {
            $genderParent = Category::create([
                'name' => $genderName,
                'slug' => Str::slug($genderName),
            ]);

            foreach ($subCategories as $subName => $productNames) {
                $sub = Category::create([
                    'name' => $subName,
                    'slug' => Str::slug($genderName . '-' . $subName),
                    'parent_id' => $genderParent->id,
                ]);

                foreach ($productNames as $pName) {
                    Product::create([
                        'category_id' => $sub->id,
                        'name' => $pName,
                        'slug' => Str::slug($pName) . '-' . Str::random(3),
                        'description' => "Premium {$pName} specifically crafted for our {$genderName} collection.",
                        'price' => rand(20, 150),
                        'stock' => rand(15, 60),
                        'image' => null
                    ]);
                }
            }
        }

        $accessoryCatalog = [
            'Headwear' => ['Premium Black Snapback', 'Minimalist Dad Hat', 'Vintage Beanie Cap', 'Urban Bucket Hat'],
            'Jewelry' => ['Silver Chain Necklace', 'Industrial Style Bracelet', 'Minimalist Ring Set'],
            'Lifestyle' => ['Tactical Backpack', 'Utility Crossbody Bag', 'Leather Wallet Node', 'Tech Keychain'],
        ];

        $accParent = Category::create([
            'name' => 'ACCESSORIES',
            'slug' => 'accessories',
        ]);

        foreach ($accessoryCatalog as $subName => $productNames) {
            $sub = Category::create([
                'name' => $subName,
                'slug' => Str::slug('acc-' . $subName),
                'parent_id' => $accParent->id,
            ]);

            foreach ($productNames as $pName) {
                Product::create([
                    'category_id' => $sub->id,
                    'name' => $pName,
                    'slug' => Str::slug($pName) . '-' . Str::random(3),
                    'description' => "Essential {$pName} to complete your identity setup.",
                    'price' => rand(15, 85),
                    'stock' => rand(20, 100),
                    'image' => null
                ]);
            }
        }

        $unisexDrops = [
            'new-drop' => ['Reflective Windbreaker', 'Shadow Cargo Pants', 'Limited Identity Tee'],
            'essentials' => ['Cotton Crew Socks', 'Basic Beanie Hat', 'Everyday Crossbody Bag'],
            'extras' => ['Tactical Keychain', 'Industrial Buckle Belt', 'Tech Phone Case'],
            'trend' => ['Cyberpunk Utility Vest', 'Neon Patch Sweatshirt', 'Modular Sling Bag']
        ];

        foreach ($unisexDrops as $slug => $items) {
            $cat = Category::create([
                'name' => Str::title(str_replace('-', ' ', $slug)),
                'slug' => $slug,
            ]);

            foreach ($items as $itemName) {
                Product::create([
                    'category_id' => $cat->id,
                    'name' => $itemName,
                    'slug' => Str::slug($itemName),
                    'description' => "Exclusive asset from the {$slug} unisex drop.",
                    'price' => rand(45, 190),
                    'stock' => rand(5, 25),
                    'image' => null
                ]);
            }
        }
    }
}