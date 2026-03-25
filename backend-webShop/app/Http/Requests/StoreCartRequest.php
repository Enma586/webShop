<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Product;

class StoreCartRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantity'   => [
                'required', 'integer', 'min:1',
                function ($attribute, $value, $fail) {
                    $product = Product::find($this->product_id);
                    if ($product && $value > $product->stock) {
                        $fail("Don´t have enough units. Only {$product->stock} units available.");
                    }
                }
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'The product_id field is required.',
            'product_id.exists'   => 'The specified product does not exist.',
            'quantity.required'   => 'The quantity field is required.',
            'quantity.integer'    => 'The quantity must be an integer.',
            'quantity.min'        => 'The quantity must be at least 1.',
        ];
    }
}