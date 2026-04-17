<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;

/**
 * MovementService - Cadeia de Comando Logística.
 * Gere o envio e trânsito de colunas militares.
 * PASSO 7 - Estrutura Inicial.
 */
class MovementService
{
    private MapService $mapService;

    public function __construct(MapService $mapService)
    {
        $this->mapService = $mapService;
    }

    /**
     * Inicia um movimento militar entre bases.
     */
    public function sendMovement(Base $origin, Base $target, array $units, string $type = 'attack')
    {
        return DB::transaction(function() use ($origin, $target, $units, $type) {
            // No futuro simplificado, a velocidade pode ser fixa ou baseada em unidades.
            $distance = $this->mapService->calculateDistance($origin, $target);
            $travelTimeSeconds = (int) ($distance * 10); // Ex: 10 segundos por unidade de distância

            $now = now();
            $arrivalTime = $now->copy()->addSeconds($travelTimeSeconds);

            // Criar registo de movimento (TBD - Tabela movements necessária)
            // return Movement::create([...]);
            
            return [
                'origin_id' => $origin->id,
                'target_id' => $target->id,
                'distance' => $distance,
                'arrival_time' => $arrivalTime
            ];
        });
    }
}
