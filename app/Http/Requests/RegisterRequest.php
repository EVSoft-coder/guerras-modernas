<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): bool|array
    {
        return [
            'username' => 'required|string|max:50|unique:jogadores',
            'email'    => 'required|email|unique:jogadores',
            'password' => 'required|string|min:6|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique' => 'Este nome de comandante já está em uso.',
            'email.unique'    => 'Este email já está registado nas nossas bases.',
            'password.min'    => 'A senha deve ter pelo menos 6 caracteres para segurança máxima.',
            'password.confirmed' => 'As senhas não coincidem.',
        ];
    }
}
