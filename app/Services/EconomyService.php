<?php
 
namespace App\Services;
 
use App\Models\Base;
use App\Domain\Economy\EconomyRules;
use Illuminate\Support\Facades\DB;
 
class EconomyService
{
    /**
     * Atualiza os recursos da base com base no tempo passado.
     */
    public function atualizarRecursos(Base $base)
    {
        $recursos = $base->recursos;
        if (!$recursos) return;
 
        $agora = now();
        $ultimaVez = $recursos->updated_at;
        $segundosPassados = $agora->diffInSeconds($ultimaVez);
 
        if ($segundosPassados <= 0) return;
 
        $taxasPerMinute = $this->obterTaxasProducao($base);
 
        foreach ($taxasPerMinute as $res => $rate) {
            $incremento = ($rate / 60) * $segundosPassados;
            $recursos->$res += $incremento;
        }
 
        $recursos->save();
    }
 
    /**
     * Calcula as taxas de produção atuais da base.
     */
    public function obterTaxasProducao(Base $base): array
    {
        return [
            'suprimentos' => EconomyRules::calculateProductionPerMinute('suprimentos', $base->edificios()->where('tipo', 'mina_suprimentos')->first()?->nivel ?? 0),
            'combustivel' => EconomyRules::calculateProductionPerMinute('combustivel', $base->edificios()->where('tipo', 'refinaria')->first()?->nivel ?? 0),
            'municoes' => EconomyRules::calculateProductionPerMinute('municoes', $base->edificios()->where('tipo', 'fabrica_municoes')->first()?->nivel ?? 0),
            'pessoal' => EconomyRules::calculateProductionPerMinute('pessoal', $base->edificios()->where('tipo', 'posto_recrutamento')->first()?->nivel ?? 0),
        ];
    }
 
    /**
     * Valida e consome recursos.
     */
    public function consumir(Base $base, array $custos): bool
    {
        return DB::transaction(function() use ($base, $custos) {
            $recursos = $base->recursos;
            
            foreach ($custos as $res => $qtd) {
                if ($recursos->$res < $qtd) return false;
            }
 
            foreach ($custos as $res => $qtd) {
                $recursos->decrement($res, $qtd);
            }
 
            return true;
        });
    }
}
