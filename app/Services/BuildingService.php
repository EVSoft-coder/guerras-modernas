<?php
 
namespace App\Services;
 
use App\Models\Base;
use App\Models\Edificio;
use App\Models\Construcao;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use Illuminate\Support\Facades\DB;
 
class BuildingService
{
    protected $economyService;
 
    public function __construct(EconomyService $economyService)
    {
        $this->economyService = $economyService;
    }
 
    /**
     * Inicia o upgrade de um edifício.
     */
    public function upgrade(Base $base, string $tipoRaw)
    {
        $tipo = BuildingType::normalize($tipoRaw);
        
        // 1. Obter nível atual
        $nivelAtual = $this->obterNivel($base, $tipo);
        
        // 2. Calcular custos e tempo
        $custos = BuildingRules::calculateCost($tipo, $nivelAtual);
        $tempo = BuildingRules::calculateTime($tipo, $nivelAtual);
 
        return DB::transaction(function() use ($base, $tipo, $custos, $tempo) {
            // 3. Consumir recursos via EconomyService
            if (!$this->economyService->consumir($base, $custos)) {
                throw new \Exception("Recursos insuficientes para expansão de " . $tipo);
            }
 
            // 4. Inserir na fila de construção
            return Construcao::create([
                'base_id' => $base->id,
                'edificio_tipo' => $tipo,
                'nivel_destino' => $nivelAtual + 1,
                'completado_em' => now()->addSeconds($tempo),
            ]);
        });
    }
 
    /**
     * Processa a fila de construção da base.
     */
    public function processarFila(Base $base)
    {
        $construcoes = $base->construcoes()->where('completado_em', '<=', now())->get();
 
        foreach ($construcoes as $fila) {
            DB::transaction(function() use ($base, $fila) {
                $tipo = $fila->edificio_tipo;
 
                if ($tipo === BuildingType::QG) {
                    $base->increment('qg_nivel');
                } elseif ($tipo === BuildingType::MURALHA) {
                    $base->increment('muralha_nivel');
                } else {
                    $edificio = $base->edificios()->where('tipo', $tipo)->first();
                    if ($edificio) {
                        $edificio->increment('nivel');
                    } else {
                        Edificio::create(['base_id' => $base->id, 'tipo' => $tipo, 'nivel' => 1]);
                    }
                }
                
                $fila->delete();
            });
        }
    }
 
    /**
     * Helper para obter nível atual de qualquer edifício.
     */
    public function obterNivel(Base $base, string $tipo): int
    {
        if ($tipo === BuildingType::QG) return $base->qg_nivel;
        if ($tipo === BuildingType::MURALHA) return $base->muralha_nivel;
        
        return $base->edificios()->where('tipo', $tipo)->first()?->nivel ?? 0;
    }
}
