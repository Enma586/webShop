<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = ['user_id', 'product_id', 'quantity'];

    // Realation to the product in the cart
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Relation wirh the user who owns the cart item
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}