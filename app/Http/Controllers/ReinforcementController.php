<?php

namespace App\Http\Controllers;

use App\Models\Reinforcement;
use App\Models\Movement;
use App\Services\MapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReinforcementController extends Controller
{
    protected MapService $mapService;

    public function __construct(MapService $mapService)
    {
        $this->mapService = $mapService;
    }

    /**
     * Retira tropas enviadas para uma base aliada.
     */
    public function recall($id)
    {
        return DB::transaction(function() use ($id) {
            $reinforcement = Reinforcement::with(['type', 'originBase', 'targetBase'])->findOrFail($id);
            $user = Auth::user();
            
            if ($reinforcement->originBase->jogador_id !== $user->id) {
                return response()->json(['status' => 'error', 'message' => 'NEGADO: Você não tem autoridade sobre estas tropas.'], 403);
            }

            // Calcular tempo de retorno
            $speed = $reinforcement->type->speed ?? config('game.movement.base_speed', 1.0);
            $seconds = $this->mapService->calculateTravelTime($reinforcement->originBase, $reinforcement->targetBase, $speed);

            // Criar Movimento de Retorno
            $movement = Movement::create([
                'origin_id' => $reinforcement->target_base_id,
                'target_id' => $reinforcement->origin_base_id,
                'type' => 'return',
                'status' => 'moving',
                'start_time' => now(),
                'end_time' => now()->addSeconds($seconds),
            ]);

            $movement->units()->create([
                'unit_type_id' => $reinforcement->unit_type_id,
                'quantity' => $reinforcement->quantity
            ]);

            $reinforcement->delete();

            return redirect()->back()->with('success', 'RETIRADA: As tropas iniciaram a marcha de regresso.');
        });
    }

    /**
     * Dispensar tropas aliadas estacionadas na sua base.
     */
    public function dismiss($id)
    {
        return DB::transaction(function() use ($id) {
            $reinforcement = Reinforcement::with(['type', 'originBase', 'targetBase'])->findOrFail($id);
            $user = Auth::user();
            
            if ($reinforcement->targetBase->jogador_id !== $user->id) {
                return response()->json(['status' => 'error', 'message' => 'NEGADO: Você não pode dispensar tropas de bases alheias.'], 403);
            }

            // Calcular tempo de retorno
            $speed = $reinforcement->type->speed ?? config('game.movement.base_speed', 1.0);
            $seconds = $this->mapService->calculateTravelTime($reinforcement->originBase, $reinforcement->targetBase, $speed);

            // Criar Movimento de Retorno
            $movement = Movement::create([
                'origin_id' => $reinforcement->target_base_id,
                'target_id' => $reinforcement->origin_base_id,
                'type' => 'return',
                'status' => 'moving',
                'start_time' => now(),
                'end_time' => now()->addSeconds($seconds),
            ]);

            $movement->units()->create([
                'unit_type_id' => $reinforcement->unit_type_id,
                'quantity' => $reinforcement->quantity
            ]);

            $reinforcement->delete();

            return redirect()->back()->with('success', 'DISPENSA: As tropas aliadas foram notificadas para regressar à origem.');
        });
    }
}
