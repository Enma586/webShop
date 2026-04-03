<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'municipality_id',
        'district_id', // <--- Nuevo campo agregado
        'address_line',
        'postal_code',
        'country',
        'phone',
        'is_default'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}