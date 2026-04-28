<?php

namespace App\Http\Controllers;

use App\Models\UnitType;
use App\Services\CombatService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SimulatorController extends Controller
{
    protected $combatService;

    public function __construct(CombatService $combatService)
    {
        $this->combatService = $combatService;
    }

    public function index()
    {
        return Inertia::render('Simulator/Index', [
            'unitTypes' => UnitType::all()
        ]);
    }

    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'attacker_units' => 'required|array',
            'defender_units' => 'required|array',
            'wall_level' => 'required|integer|min:0|max:20',
            'luck' => 'required|integer|min:-25|max:25',
            'moral' => 'required|integer|min:30|max:100',
            'night_bonus' => 'required|boolean'
        ]);

        $unitTypes = UnitType::all()->keyBy('id');

        // Preparar unidades atacantes
        $atkUnits = [];
        foreach ($validated['attacker_units'] as $id => $qty) {
            if ($qty <= 0) continue;
            $type = $unitTypes->get($id);
            if (!$type) continue;
            $atkUnits[] = [
                'id' => $id,
                'name' => $type->name,
                'attack' => $type->attack,
                'defense' => $type->defense,
                'quantity' => (int) $qty
            ];
        }

        // Preparar unidades defensoras
        $defUnits = [];
        foreach ($validated['defender_units'] as $id => $qty) {
            if ($qty <= 0) continue;
            $type = $unitTypes->get($id);
            if (!$type) continue;
            $defUnits[] = [
                'id' => $id,
                'origin' => 'base', // Simulado como base para fins de UI
                'name' => $type->name,
                'attack' => $type->attack,
                'defense' => $type->defense,
                'quantity' => (int) $qty
            ];
        }

        // Simular bónus de muralha manualmente para o serviço
        // Já que o serviço espera um objeto Base, vamos passar nulo e calcular o bónus se necessário
        // Ou melhor, o serviço tem lógica de muralha se houver $defenderBase.
        // Vou injetar o bónus manualmente ou passar uma base mockada.
        
        $result = $this->combatService->resolveBattle(
            $atkUnits, 
            $defUnits, 
            null, // Sem jogador atacante para evitar bónus de pesquisa reais
            null, // Sem jogador defensor
            null, // Sem base real
            null, // Sem general
            null  // Sem general
        );

        // Substituir estatísticas pela simulação do user (sorte/moral/muralha)
        // O serviço gera sorte aleatória, mas o simulador permite fixar.
        // Vou forçar os valores do simulador no resultado.
        
        $result['stats']['luck'] = $validated['luck'] / 100;
        $result['stats']['moral'] = $validated['moral'];
        $result['stats']['wall_bonus'] = $validated['wall_level'] * 0.05;
        $result['stats']['is_night'] = $validated['night_bonus'];

        return response()->json($result);
    }
}
