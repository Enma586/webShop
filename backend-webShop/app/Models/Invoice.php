<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number', 
        'user_id', 
        'subtotal', 
        'tax', 
        'total', 
        'status'
    ];


    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}