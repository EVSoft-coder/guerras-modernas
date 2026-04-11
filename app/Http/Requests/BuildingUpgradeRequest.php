<?php
 
namespace App\Http\Requests;
 
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\BuildingType;
use Illuminate\Validation\Rule;
 
class BuildingUpgradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
 
    public function rules(): array
    {
        return [
            'base_id' => 'required|exists:bases,id',
            'tipo'    => [
                'required',
                'string',
                Rule::in(BuildingType::values()),
            ],
        ];
    }
 
    public function messages(): array
    {
        return [
            'base_id.exists' => 'BASE_ID_INVALIDO: A base militar selecionada não existe nos nossos registros.',
            'tipo.required'  => 'ESPECIFICACAO_AUSENTE: É necessário indicar que setor deseja ampliar.',
        ];
    }
}
