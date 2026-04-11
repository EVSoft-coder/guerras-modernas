<?php
 
namespace App\Services;
 
use App\Models\Base;
use App\Models\Tropa;
use App\Models\Treino;
use App\Domain\Unit\UnitRules;
use Illuminate\Support\Facades\DB;
 
class UnitService
{
    protected $economyService;
 
    public function __construct(EconomyService $economyService)
    {
        $this->economyService = $economyService;
    }
 
    /**
     * Inicia o treino de um pelotão.
     */
    public function treinar(Base $base, string $unidade, int $quantidade)
    {
        $custos = UnitRules::calculateCost($unidade, $quantidade);
        $tempo = UnitRules::calculateTime($unidade, $quantidade);
 
        return DB::transaction(function() use ($base, $unidade, $quantidade, $custos, $tempo) {
            if (!$this->economyService->consumir($base, $custos)) {
                throw new \Exception("Suprimentos ou fundos insuficientes para mobilização.");
            }
 
            return Treino::create([
                'base_id' => $base->id,
                'unidade' => $unidade,
                'quantidade' => $quantidade,
                'completado_em' => now()->addSeconds($tempo),
            ]);
        });
    }
 
    /**
     * Processa a fila de treino terminada.
     */
    public function processarFila(Base $base)
    {
        $treinos = $base->treinos()->where('completado_em', '<=', now())->get();
 
        foreach ($treinos as $fila) {
            DB::transaction(function() use ($base, $fila) {
                $tropa = $base->tropas()->firstOrCreate(
                    ['unidade' => $fila->unidade],
                    ['quantidade' => 0]
                );
                $tropa->increment('quantidade', $fila->quantidade);
                $fila->delete();
            });
        }
    }
}
