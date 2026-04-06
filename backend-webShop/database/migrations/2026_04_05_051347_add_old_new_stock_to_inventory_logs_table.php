<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_logs', function (Blueprint $table) {
            $table->integer('old_stock')->default(0)->after('quantity');
            $table->integer('new_stock')->default(0)->after('old_stock');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_logs', function (Blueprint $table) {
            $table->dropColumn(['old_stock', 'new_stock']);
        });
    }
};
