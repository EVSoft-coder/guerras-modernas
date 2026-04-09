<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AtacarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'origem_id'  => 'required|exists:bases,id',
            'destino_id' => 'required|exists:bases,id',
            'tropas'     => 'required|array',
            'tipo'       => 'required|in:saque,conquista,reforco,espionagem',
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.in' => 'Missão militar inválida.',
            'tropas.required' => 'Deve mobilizar pelo menos um contingente para a missão.',
        ];
    }
}
