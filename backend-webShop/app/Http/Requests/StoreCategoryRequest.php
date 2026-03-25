<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Asegúrate de que esté en true
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:100|unique:categories,name',
            'slug'        => 'required|string|max:120|unique:categories,slug', 
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|integer|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'DATA_ERROR: Category name is mandatory.',
            'name.unique'   => 'CONFLICT: This category name already exists.',
            'slug.required' => 'PROTOCOL_ERROR: Slug mapping failed.',
            'slug.unique'   => 'CONFLICT: Slug reference already in use.',
        ];
    }
}