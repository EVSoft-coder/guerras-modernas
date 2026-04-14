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

    public function authenticate(): void
    {
        if (! \Illuminate\Support\Facades\Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }
    }
}
