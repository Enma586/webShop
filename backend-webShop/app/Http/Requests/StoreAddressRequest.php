<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'user_id'         => 'sometimes|exists:users,id',
            'department_id'   => 'required|exists:departments,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'address_line'    => 'required|string|max:255',
            'postal_code'     => 'nullable|string|max:20',
            'country'         => 'sometimes|string|max:100',
            'phone'           => 'required|string|max:20',
            'is_default'      => 'sometimes|boolean'
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'department_id.required'   => 'Please select a department.',
            'department_id.exists'     => 'The selected department is invalid.',
            'municipality_id.required' => 'Please select a municipality.',
            'municipality_id.exists'   => 'The selected municipality is invalid.',
            'address_line.required'    => 'The specific street address is mandatory.',
            'phone.required'           => 'A contact phone number is required for delivery.',
        ];
    }
}