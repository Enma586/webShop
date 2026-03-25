<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Importamos tu modelo User

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name'     => 'Administrator',
            'username' => 'admin_system',      // Tu campo username
            'email'    => 'admin@example.com', // Tu campo email
            'password' => 'admin1234',         // El modelo lo encriptará solo
            'role'     => 'admin',             // Tu ENUM de la base de datos
        ]);
    }
}