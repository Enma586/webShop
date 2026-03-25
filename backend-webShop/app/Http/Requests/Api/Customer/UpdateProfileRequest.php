<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        // Usamos $this->user()->id para obtener el ID del usuario que envía el token
        return [
            'name'     => 'sometimes|string|max:100',
            'username' => 'sometimes|string|max:50|unique:users,username,' . $this->user()->id,
            'email'    => 'sometimes|email|max:150|unique:users,email,' . $this->user()->id,
            'password' => 'sometimes|min:8|confirmed',
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