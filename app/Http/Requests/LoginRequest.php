<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): bool|array
    {
        return [
            'email'    => 'required|email',
            'password' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'O email de oficial é obrigatório.',
            'password.required' => 'A senha secreta é necessária para o login.',
        ];
    }
}
