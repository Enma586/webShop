<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{


    protected $fillable = ['order_id', 'product_id', 'quantity', 'unit_price'];

    /**
     * Relaction : What product is this order item for?
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relation : Which order does this item belong to?
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}