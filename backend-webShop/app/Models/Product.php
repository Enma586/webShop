<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'category_id', 
        'name', 
        'slug',
        'description', 
        'price', 
        'stock', 
        'image'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function history(): HasMany
    {
        return $this->hasMany(ProductHistory::class, 'product_id', 'id');
    }
}