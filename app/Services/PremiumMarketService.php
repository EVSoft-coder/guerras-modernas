<?php

namespace App\Services;

use App\Models\Jogador;
use App\Models\Base;
use App\Models\MercadoPremium;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PremiumMarketService
{
    /**
     * Coloca recursos à venda por Pontos Premium.
     */
    public function createOffer(Jogador $jogador, Base $base, string $resourceType, int $amount, int $pricePp): MercadoPremium
    {
        return DB::transaction(function() use ($jogador, $base, $resourceType, $amount, $pricePp) {
            // Sincronizar e validar recursos
            app(ResourceService::class)->syncResources($base);
            $recursos = $base->recursos;

            if ($recursos->$resourceType < $amount) {
                throw new \Exception("MERCADO: Recursos insuficientes na base.");
            }

            if ($pricePp <= 0) {
                throw new \Exception("MERCADO: O preço deve ser superior a 0 PP.");
            }

            // Debitar recursos
            $recursos->decrement($resourceType, $amount);

            $offer = MercadoPremium::create([
                'vendedor_id' => $jogador->id,
                'recurso_tipo' => $resourceType,
                'quantidade' => $amount,
                'preco_pp' => $pricePp,
                'status' => 'open'
            ]);

            Log::channel('game')->info("[PREMIUM_MARKET] Oferta criada por {$jogador->username}: {$amount}x {$resourceType} por {$pricePp} PP");

            return $offer;
        }, 5);
    }

    /**
     * Compra uma oferta do mercado.
     */
    public function buyOffer(Jogador $comprador, int $offerId, Base $targetBase): bool
    {
        return DB::transaction(function() use ($comprador, $offerId, $targetBase) {
            $offer = MercadoPremium::where('id', $offerId)
                ->where('status', 'open')
                ->lockForUpdate()
                ->firstOrFail();

            if ($offer->vendedor_id === $comprador->id) {
                throw new \Exception("MERCADO: Não pode comprar a sua própria oferta.");
            }

            $lockedComprador = Jogador::where('id', $comprador->id)->lockForUpdate()->first();
            
            if ($lockedComprador->pontos_premium < $offer->preco_pp) {
                throw new \Exception("MERCADO: Pontos Premium insuficientes.");
            }

            // 1. Debitar PP do comprador
            $lockedComprador->decrement('pontos_premium', $offer->preco_pp);

            // 2. Creditar PP ao vendedor
            $vendedor = Jogador::where('id', $offer->vendedor_id)->lockForUpdate()->first();
            $vendedor->increment('pontos_premium', $offer->preco_pp);

            // 3. Entregar recursos à base do comprador
            app(ResourceService::class)->syncResources($targetBase);
            $targetBase->recursos->increment($offer->recurso_tipo, $offer->quantidade);

            // 4. Fechar oferta
            $offer->update(['status' => 'completed']);

            Log::channel('game')->info("[PREMIUM_MARKET] Oferta #{$offer->id} concluída. {$comprador->username} comprou de {$vendedor->username}");

            return true;
        }, 5);
    }

    /**
     * Cancela uma oferta.
     */
    public function cancelOffer(int $offerId): bool
    {
        return DB::transaction(function() use ($offerId) {
            $offer = MercadoPremium::where('id', $offerId)
                ->where('status', 'open')
                ->lockForUpdate()
                ->firstOrFail();

            $vendedor = $offer->vendedor;
            
            // Devolver recursos à base principal do vendedor (ou primeira base)
            $base = $vendedor->bases()->first();
            if ($base) {
                app(ResourceService::class)->syncResources($base);
                $base->recursos->increment($offer->recurso_tipo, $offer->quantidade);
            }

            $offer->update(['status' => 'cancelled']);

            return true;
        }, 5);
    }
}
