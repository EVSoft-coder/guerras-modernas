<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Jogador;
use Illuminate\Support\Facades\DB;

class AcademyService
{
    /**
     * Mint a coin in a base.
     * Standard cost based on Tribal Wars settings.
     */
    public function mintCoin(Base $base): void
    {
        DB::transaction(function() use ($base) {
            $jogador = $base->jogador;
            
            // Sincronizar recursos antes de cobrar
            app(ResourceService::class)->syncResources($base);
            $rec = $base->recursos()->lockForUpdate()->first();

            // Custo da moeda (Tribal Wars Standard)
            // Wood 28000, Clay 30000, Iron 25000
            // Mapping: Wood -> Suprimentos, Clay -> Combustível, Iron -> Munições
            $costs = [
                'suprimentos' => 28000,
                'combustivel' => 30000,
                'municoes' => 25000
            ];

            foreach ($costs as $res => $amount) {
                if ($rec->{$res} < $amount) {
                    throw new \Exception("LOGÍSTICA: " . strtoupper($res) . " insuficientes para cunhar moedas.");
                }
            }

            // Verificar se tem Centro de Comando Nível 20
            $gameService = new GameService();
            $level = $gameService->obterNivelEdificio($base, 'hq');
            if ($level < 20) {
                throw new \Exception("ENGENHARIA: Necessita de um Centro de Comando (HQ) Nível 20 para cunhar moedas.");
            }

            // Debitar recursos
            foreach ($costs as $res => $amount) {
                $rec->decrement($res, $amount);
            }

            // Incrementar moedas do jogador
            $jogador->increment('moedas');
            
            \Illuminate\Support\Facades\Log::channel('game')->info("[GAME_ENGINE] MINT_COIN Player:{$jogador->id} Base:{$base->id}");
        }, 5);
    }
}
