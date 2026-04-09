<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TreinarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'base_id'    => 'required|exists:bases,id',
            'unidade'    => 'required|string',
            'quantidade' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'quantidade.min' => 'A ordem de recrutamento deve ser de pelo menos 1 unidade.',
            'unidade.required' => 'Divisão militar não especificada.',
        ];
    }
}
