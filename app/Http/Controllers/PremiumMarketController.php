<?php

namespace App\Http\Controllers;

use App\Models\Base;
use App\Models\MercadoPremium;
use App\Services\PremiumMarketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PremiumMarketController extends Controller
{
    protected $marketService;

    public function __construct(PremiumMarketService $marketService)
    {
        $this->marketService = $marketService;
    }

    public function index()
    {
        $jogador = auth()->user();
        $offers = MercadoPremium::where('status', 'open')
            ->with('vendedor')
            ->orderBy('created_at', 'desc')
            ->get();

        $myOffers = MercadoPremium::where('vendedor_id', $jogador->id)
            ->where('status', 'open')
            ->get();

        $bases = $jogador->bases()->with('recursos')->get();

        return Inertia::render('Premium/Market', [
            'offers' => $offers,
            'myOffers' => $myOffers,
            'bases' => $bases
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'resource_type' => 'required|string|in:suprimentos,combustivel,municoes,metal,energia',
            'amount' => 'required|integer|min:100',
            'price_pp' => 'required|integer|min:1'
        ]);

        $jogador = auth()->user();
        $base = Base::where('id', $request->base_id)
            ->where('jogador_id', $jogador->id)
            ->firstOrFail();

        try {
            $this->marketService->createOffer(
                $jogador,
                $base,
                $request->resource_type,
                $request->amount,
                $request->price_pp
            );

            return back()->with('success', 'Oferta colocada no mercado.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function buy(Request $request, int $id)
    {
        $request->validate([
            'target_base_id' => 'required|exists:bases,id'
        ]);

        $jogador = auth()->user();
        $targetBase = Base::where('id', $request->target_base_id)
            ->where('jogador_id', $jogador->id)
            ->firstOrFail();

        try {
            $this->marketService->buyOffer($jogador, $id, $targetBase);
            return back()->with('success', 'Recursos adquiridos com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        $jogador = auth()->user();
        $offer = MercadoPremium::where('id', $id)
            ->where('vendedor_id', $jogador->id)
            ->firstOrFail();

        try {
            $this->marketService->cancelOffer($id);
            return back()->with('success', 'Oferta cancelada e recursos devolvidos.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
