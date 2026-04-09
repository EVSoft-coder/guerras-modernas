<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpgradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'base_id' => 'required|exists:bases,id',
            'tipo'    => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'base_id.exists' => 'Base militar não identificada.',
            'tipo.required'  => 'Designação de edifício é obrigatória.',
        ];
    }
}
