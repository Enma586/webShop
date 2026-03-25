<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductHistory extends Model
{
    protected $table = 'product_histories';

    // Si tu tabla NO tiene la columna updated_at, deja esto en false:
    public $timestamps = false; 

    protected $fillable = [
        'product_id',
        'user_id',
        'old_price',
        'new_price',
        'old_data',
        'action',
        'slug'
    ];

    protected $casts = [
        'old_data' => 'array', // Esto convierte el JSON a Array y viceversa
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}