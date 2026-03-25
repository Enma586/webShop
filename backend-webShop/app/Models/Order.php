<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = ['user_id', 'address_id', 'total', 'status'];

    // Orden has a lot of items
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Who made the order
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // where to send the order
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
}