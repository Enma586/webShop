<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductHistory extends Model
{
    protected $table = 'product_histories';

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
        'old_data' => 'array',
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}