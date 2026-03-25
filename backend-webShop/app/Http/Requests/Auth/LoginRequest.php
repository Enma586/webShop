<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    // Permitimos que cualquier usuario acceda a este intento de login
    public function authorize(): bool
    {
        return true;
    }

    // Reglas de validación
    public function rules(): array
    {
        return [
            'username' => 'required|email|string',
            'password' => 'required|string',
        ];
    }

    // Mensajes de error en inglés
    public function messages(): array
    {
        return [
            'username.required' => 'The username (email) field is required.',
            'username.email'    => 'The username must be a valid email address.',
            'password.required' => 'The password field is required.',
        ];
    }
}