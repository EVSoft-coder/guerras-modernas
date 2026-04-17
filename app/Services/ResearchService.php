<?php
 
namespace App\Services;
 
use App\Models\Jogador;
use App\Models\Pesquisa;
use App\Models\Base;
use App\Domain\Research\ResearchRules;
use Illuminate\Support\Facades\DB;
 
class ResearchService
{
    protected $economyService;
    protected $timeService;
 
    public function __construct(EconomyService $economyService, ?TimeService $timeService = null)
    {
        $this->economyService = $economyService;
        $this->timeService = $timeService ?? new TimeService();
    }
 
    /**
     * Inicia uma pesquisa tecnológica.
     */
    public function pesquisar(Jogador $jogador, Base $base, string $tech)
    {
        $currentLevel = $jogador->obterNivelTech($tech);
        $custos = ResearchRules::calculateCost($tech, $currentLevel);
        $tempo = ResearchRules::calculateTime($tech, $currentLevel);
 
        return DB::transaction(function() use ($jogador, $base, $tech, $custos, $tempo) {
            if (!$this->economyService->consumir($base, $custos)) {
                throw new \Exception("Suprimentos insuficientes para iniciar I&D de " . $tech);
            }
 
            return Pesquisa::create([
                'jogador_id' => $jogador->id,
                'tech' => $tech,
                'nivel' => $currentLevel + 1,
                'completado_em' => $this->timeService->now()->addSeconds($tempo),
            ]);
        });
    }
}
