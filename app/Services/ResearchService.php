<?php
 
namespace App\Services;
 
use App\Models\Jogador;
use App\Models\Pesquisa;
use App\Models\Base;
use App\Domain\Research\ResearchRules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
 
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
        $config = config("research.{$tech}");
        if (!$config) {
            throw new \Exception("Tecnologia desconhecida: {$tech}");
        }

        // Verificar nível máximo
        $currentLevel = $jogador->obterNivelTech($tech);
        if ($currentLevel >= $config['max_level']) {
            throw new \Exception("Tecnologia {$config['name']} já atingiu o nível máximo ({$config['max_level']}).");
        }

        // Verificar se já tem pesquisa ativa (só 1 por vez)
        $activeResearch = Pesquisa::where('jogador_id', $jogador->id)
            ->where('completado_em', '>', now())
            ->first();
        if ($activeResearch) {
            throw new \Exception("Já existe uma pesquisa em andamento. Aguarde a conclusão.");
        }

        // Verificar edifício necessário
        if (!empty($config['requires_building'])) {
            $buildingLevel = $base->edificios
                ->where('tipo', $config['requires_building'])
                ->first()?->nivel ?? 0;
            
            if ($buildingLevel < ($config['requires_level'] ?? 1)) {
                throw new \Exception("Necessário {$config['requires_building']} nível {$config['requires_level']}.");
            }
        }

        $custos = ResearchRules::calculateCost($tech, $currentLevel);
        $tempo = ResearchRules::calculateTime($tech, $currentLevel);
 
        return DB::transaction(function() use ($jogador, $base, $tech, $custos, $tempo) {
            if (!$this->consumirRecursos($base, $custos)) {
                throw new \Exception("Recursos insuficientes para iniciar I&D.");
            }
 
            $pesquisa = Pesquisa::create([
                'jogador_id' => $jogador->id,
                'tipo' => $tech,
                'nivel' => $jogador->obterNivelTech($tech) + 1,
                'completado_em' => now()->addSeconds($tempo),
            ]);

            Log::channel('game')->info("[RESEARCH_STARTED] Jogador #{$jogador->id} iniciou {$tech} L{$pesquisa->nivel}", [
                'tempo_segundos' => $tempo,
                'completado_em' => $pesquisa->completado_em->toDateTimeString()
            ]);

            return $pesquisa;
        });
    }

    /**
     * Processa pesquisas completas de um jogador (chamado pelo GameEngine).
     */
    public function processResearch(Jogador $jogador): void
    {
        $completed = Pesquisa::where('jogador_id', $jogador->id)
            ->where('completado_em', '<=', now())
            ->whereNull('processed_at')
            ->get();

        foreach ($completed as $pesquisa) {
            $pesquisa->update(['processed_at' => now()]);
            Log::channel('game')->info("[RESEARCH_COMPLETE] {$pesquisa->tipo} L{$pesquisa->nivel} para jogador #{$jogador->id}");
        }
    }

    /**
     * Obtém os bónus de pesquisa de um jogador para uso no combate.
     */
    public function getResearchBonuses(Jogador $jogador): array
    {
        $bonuses = [
            'attack_bonus' => 0,
            'defense_bonus' => 0,
            'speed_bonus' => 0,
            'storage_bonus' => 0,
            'production_bonus_energia' => 0,
            'production_bonus_metal' => 0,
        ];

        $researchConfig = config('research');
        
        foreach ($researchConfig as $techKey => $techConfig) {
            $level = $jogador->obterNivelTech($techKey);
            if ($level > 0 && isset($techConfig['effect']) && isset($bonuses[$techConfig['effect']])) {
                $bonuses[$techConfig['effect']] += $level * $techConfig['bonus_per_level'];
            }
        }

        // Desbloqueios
        $bonuses['espionagem_unlocked'] = $jogador->obterNivelTech('espionagem_avancada') >= 1;
        $bonuses['aerea_unlocked'] = $jogador->obterNivelTech('guerra_aerea') >= 1;

        return $bonuses;
    }

    /**
     * Obtém o estado de pesquisa para o frontend.
     */
    public function getResearchState(Jogador $jogador, Base $base): array
    {
        $researchConfig = config('research');
        $activeResearch = Pesquisa::where('jogador_id', $jogador->id)
            ->where('completado_em', '>', now())
            ->first();

        $technologies = [];
        foreach ($researchConfig as $key => $tech) {
            $currentLevel = $jogador->obterNivelTech($key);
            $canResearch = true;
            $reason = null;

            // Verificar edifício
            if (!empty($tech['requires_building'])) {
                $bLevel = $base->edificios->where('tipo', $tech['requires_building'])->first()?->nivel ?? 0;
                if ($bLevel < ($tech['requires_level'] ?? 1)) {
                    $canResearch = false;
                    $reason = "Necessário {$tech['requires_building']} nível {$tech['requires_level']}";
                }
            }

            // Verificar nível máximo
            if ($currentLevel >= $tech['max_level']) {
                $canResearch = false;
                $reason = 'Nível máximo atingido';
            }

            // Verificar se já tem pesquisa ativa
            if ($activeResearch) {
                $canResearch = false;
                $reason = $reason ?? 'Pesquisa em andamento';
            }

            $costs = $currentLevel < $tech['max_level'] 
                ? ResearchRules::calculateCost($key, $currentLevel) 
                : [];
            $time = $currentLevel < $tech['max_level']
                ? ResearchRules::calculateTime($key, $currentLevel)
                : 0;

            $technologies[$key] = [
                'key' => $key,
                'name' => $tech['name'],
                'description' => $tech['description'],
                'icon' => $tech['icon'] ?? 'beaker',
                'currentLevel' => $currentLevel,
                'maxLevel' => $tech['max_level'],
                'nextCost' => $costs,
                'nextTime' => $time,
                'canResearch' => $canResearch,
                'reason' => $reason,
                'effect' => $tech['effect'],
                'bonusPerLevel' => $tech['bonus_per_level'],
            ];
        }

        return [
            'technologies' => $technologies,
            'activeResearch' => $activeResearch ? [
                'tipo' => $activeResearch->tipo,
                'nivel' => $activeResearch->nivel,
                'completado_em' => $activeResearch->completado_em->toIso8601String(),
            ] : null,
        ];
    }

    private function consumirRecursos(Base $base, array $costs): bool
    {
        $recursos = $base->recursos;
        if (!$recursos) return false;

        foreach ($costs as $tipo => $amount) {
            if (($recursos->{$tipo} ?? 0) < $amount) return false;
        }

        foreach ($costs as $tipo => $amount) {
            $recursos->decrement($tipo, $amount);
        }

        return true;
    }
}
