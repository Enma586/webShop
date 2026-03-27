<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name'     => 'sometimes|required|string|max:100',
            'username' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('users')->ignore($userId),
            ],
            'email'    => [
                'sometimes',
                'required',
                'email',
                'max:150',
                Rule::unique('users')->ignore($userId),
            ],
            'password' => 'sometimes|nullable|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique'    => 'This username is already taken.',
            'email.unique'       => 'This email is already registered.',
            'password.min'       => 'The password must be at least 8 characters.',
            'password.confirmed' => 'The password confirmation does not match.',
        ];
    }
}