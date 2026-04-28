<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PremiumService;
use Illuminate\Support\Facades\Auth;

class PremiumController extends Controller
{
    protected $premiumService;

    public function __construct(PremiumService $premiumService)
    {
        $this->premiumService = $premiumService;
    }

    public function index()
    {
        return inertia('Premium/Index', [
            'jogador' => Auth::user()->load('alianca'),
            'prices' => [
                'reduce_time' => PremiumService::COST_REDUCE_TIME,
                'premium_30' => PremiumService::COST_PREMIUM_ACCOUNT_30_DAYS
            ]
        ]);
    }

    public function reduceBuilding(Request $request)
    {
        try {
            $this->premiumService->reduceBuildingTime(Auth::user(), $request->queue_id);
            return redirect()->back()->with('success', 'Tempo de construção reduzido!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function reduceUnit(Request $request)
    {
        try {
            $this->premiumService->reduceUnitTime(Auth::user(), $request->queue_id);
            return redirect()->back()->with('success', 'Tempo de recrutamento reduzido!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function activate(Request $request)
    {
        try {
            $this->premiumService->activatePremiumAccount(Auth::user(), $request->days ?? 30);
            return redirect()->back()->with('success', 'Conta Premium ativada!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
    // Método para simular compra de pontos (para teste/desenvolvimento)
    public function buyPoints(Request $request)
    {
        $amount = $request->amount ?? 1000;
        $jogador = Auth::user();
        $jogador->increment('pontos_premium', $amount);
        
        return redirect()->back()->with('success', "{$amount} Pontos Premium creditados.");
    }
}
