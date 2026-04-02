<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Department;
use App\Models\Municipality;
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
            'Ahuachapán' => ['Ahuachapán', 'Jujutla', 'Atiquizaya', 'Concepción de Ataco', 'El Refugio', 'Guaymango', 'Apaneca', 'San Francisco Menéndez', 'San Lorenzo', 'San Pedro Puxtla', 'Turín', 'Tacuba'],
            'Santa Ana' => ['Santa Ana', 'Candelaria de la Frontera', 'Chalchuapa', 'Coatepeque', 'El Congo', 'El Porvenir', 'Masahuat', 'Metapán', 'San Antonio Pajonal', 'San Sebastián Salitrillo', 'Santa Rosa Guachipilín', 'Santiago de la Frontera', 'Texistepeque'],
            'Sonsonate' => ['Sonsonate', 'Acajutla', 'Armenia', 'Caluco', 'Cuisnahuat', 'Izalco', 'Juayúa', 'Nahuizalco', 'Nahulingo', 'Salcoatitán', 'San Antonio del Monte', 'San Julián', 'Santa Catarina Masahuat', 'Santa Isabel Ishuatán', 'Santo Domingo de Guzmán', 'Sonzacate'],
            'Chalatenango' => ['Chalatenango', 'Agua Caliente', 'Arcatao', 'Azacualpa', 'Cancasque', 'Citalá', 'Comalapa', 'Concepción Quezaltepeque', 'Dulce Nombre de María', 'El Carrizal', 'El Paraíso', 'La Laguna', 'La Palma', 'La Reina', 'Las Vueltas', 'Nombre de Jesús', 'Nueva Concepción', 'Nueva Trinidad', 'Ojos de Agua', 'Potonico', 'San Antonio de la Cruz', 'San Antonio Los Ranchos', 'San Fernando', 'San Francisco Lempa', 'San Francisco Morazán', 'San Ignacio', 'San Isidro Labrador', 'San Luis del Carmen', 'San Luis del Carmen', 'San Miguel de Mercedes', 'San Rafael', 'Santa Rita', 'Tejutla'],
            'La Libertad' => ['Santa Tecla', 'Antiguo Cuscatlán', 'Chiltiupán', 'Ciudad Arce', 'Colón', 'Comasagua', 'Huizúcar', 'Jayaque', 'Jicalapa', 'La Libertad', 'Nuevo Cuscatlán', 'Quezaltepeque', 'San Juan Opico', 'Sacacoyo', 'San José Villanueva', 'San Matías', 'San Pablo Tacachico', 'Talnique', 'Tamanique', 'Teotepeque', 'Tepecoyo', 'Zaragoza'],
            'San Salvador' => ['San Salvador', 'Aguilares', 'Apopa', 'Ayutuxtepeque', 'Cuscatancingo', 'Delgado', 'Guazapa', 'Ilopango', 'Mejicanos', 'Nejapa', 'Panchimalco', 'Rosario de Mora', 'San Marcos', 'San Martín', 'Santiago Texacuangos', 'Santo Tomás', 'Soyapango', 'Tonacatepeque', 'El Paisnal'],
            'Cuscatlán' => ['Cojutepeque', 'Candelaria', 'El Carmen', 'El Rosario', 'Monte San Juan', 'Oratorio de Concepción', 'San Bartolomé Perulapía', 'San Cristóbal', 'San José Guayabal', 'San Rafael Cedros', 'San Ramón', 'Santa Cruz Analquito', 'Santa Cruz Michapa', 'Suchitoto', 'Tenancingo', 'San Pedro Perulapán'],
            'La Paz' => ['Zacatecoluca', 'Cuyultitán', 'El Rosario', 'Jerusalén', 'Mercedes La Ceiba', 'Olocuilta', 'Paraíso de Osorio', 'San Antonio Masahuat', 'San Emigdio', 'San Francisco Chinameca', 'San Juan Nonualco', 'San Juan Talpa', 'San Juan Tepezontes', 'San Luis La Herradura', 'San Luis Talpa', 'San Miguel Tepezontes', 'San Pedro Masahuat', 'San Pedro Nonualco', 'San Rafael Obrajuelo', 'Santa María Ostuma', 'Santiago Nonualco', 'Tapalhuaca'],
            'Cabañas' => ['Sensuntepeque', 'Cinquera', 'Dolores', 'Guacotecti', 'Ilobasco', 'Jutiapa', 'San Isidro', 'Victoria'],
            'San Vicente' => ['San Vicente', 'Apastepeque', 'Guadalupe', 'San Cayetano Istepeque', 'San Esteban Catarina', 'San Ildefonso', 'San Lorenzo', 'San Sebastián', 'Santa Clara', 'Santo Domingo', 'Tecoluca', 'Tepetitán', 'Verapaz'],
            'Usulután' => ['Usulután', 'Alegría', 'Berlín', 'California', 'Concepción Batres', 'El Triunfo', 'Ereguayquín', 'Estanzuelas', 'Jiquilisco', 'Jucuapa', 'Jucuarán', 'Mercedes Umaña', 'Nueva Granada', 'Ozatlán', 'Puerto El Triunfo', 'San Agustín', 'San Buenaventura', 'San Dionisio', 'San Francisco Javier', 'Santa Elena', 'Santa María', 'Santiago de María', 'Tecapán'],
            'San Miguel' => ['San Miguel', 'Carolina', 'Chapeltique', 'Chinameca', 'Chirilagua', 'Ciudad Barrios', 'Comacarán', 'Gualococti', 'Guatajiagua', 'Lolotique', 'Moncagua', 'Nueva Guadalupe', 'Nuevo Edén de San Juan', 'Quelepa', 'San Antonio del Mosco', 'San Gerardo', 'San Jorge', 'San Luis de la Reina', 'San Rafael Oriente', 'Sesori', 'Uluazapa'],
            'Morazán' => ['San Francisco Gotera', 'Cacaopera', 'Corinto', 'Chilanga', 'Delicias de Concepción', 'El Divisadero', 'El Rosario', 'Gualococti', 'Guatajiagua', 'Joateca', 'Jocoaitique', 'Jocoro', 'Lolotiquillo', 'Meanguera', 'Osicala', 'Perquín', 'San Carlos', 'San Fernando', 'San Isidro', 'San Simón', 'Sensembra', 'Sociedad', 'Torola', 'Yamabal', 'Yoloaiquín'],
            'La Unión' => ['La Unión', 'Anamorós', 'Bolívar', 'Concepción de Oriente', 'Conchagua', 'El Carmen', 'El Sauce', 'Intipucá', 'Lislique', 'Meanguera del Golfo', 'Nueva Esparta', 'Pasaquina', 'Polorós', 'San Alejo', 'San José', 'Santa Rosa de Lima', 'Yayantique', 'Yucuaiquín'],
        ];

        foreach ($map as $depName => $munis) {
            $dep = Department::create(['name' => $depName]);
            foreach ($munis as $muniName) {
                Municipality::create(['department_id' => $dep->id, 'name' => $muniName]);
            }
        }

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