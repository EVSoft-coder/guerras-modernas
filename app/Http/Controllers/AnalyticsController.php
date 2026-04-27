<?php

namespace App\Http\Controllers;

use App\Models\PlayerStat;
use App\Models\AllianceStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Exibe o dashboard analítico.
     */
    public function index()
    {
        $jogador = Auth::user();
        
        // Dados históricos do jogador (últimos 14 dias)
        $playerHistory = PlayerStat::where('jogador_id', $jogador->id)
            ->orderBy('recorded_at', 'asc')
            ->take(14)
            ->get();

        // Dados históricos da aliança (se houver)
        $allianceHistory = [];
        if ($jogador->alianca_id) {
            $allianceHistory = AllianceStat::where('alianca_id', $jogador->alianca_id)
                ->orderBy('recorded_at', 'asc')
                ->take(14)
                ->get();
        }

        return Inertia::render('analytics/index', [
            'playerHistory' => $playerHistory,
            'allianceHistory' => $allianceHistory,
        ]);
    }
}
