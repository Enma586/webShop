<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryLog extends Model
{
    // The table name from your SQL schema
    protected $table = 'inventory_logs';

    // Disable Laravel timestamps because your DB uses DEFAULT CURRENT_TIMESTAMP
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'user_id',
        'movement_type',
        'quantity',
        'reason'
    ];

    /**
     * Relationship: The product that this log belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship: The user (admin) who performed the stock change.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}