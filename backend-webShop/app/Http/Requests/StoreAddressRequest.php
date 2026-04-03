<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB; 

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'         => 'sometimes|exists:users,id',
            'department_id'   => 'required|exists:departments,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'district_id'     => [
                'required',
                'exists:districts,id',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('districts')
                        ->where('id', $value)
                        ->where('municipality_id', $this->municipality_id)
                        ->exists();

                    if (!$exists) {
                        $fail('The selected district does not belong to the chosen municipality.');
                    }
                },
            ],
            'address_line'    => 'required|string|max:255',
            'postal_code'     => 'nullable|string|max:20',
            'country'         => 'sometimes|string|max:100',
            'phone'           => 'required|string|max:20',
            'is_default'      => 'sometimes|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required'   => 'Please select a department.',
            'department_id.exists'     => 'The selected department is invalid.',
            'municipality_id.required' => 'Please select a municipality.',
            'municipality_id.exists'   => 'The selected municipality is invalid.',
            'district_id.required'     => 'Please select a specific district.',
            'district_id.exists'       => 'The selected district is invalid.',
            'address_line.required'    => 'The specific street address is mandatory.',
            'phone.required'           => 'A contact phone number is required for delivery.',
        ];
    }
}