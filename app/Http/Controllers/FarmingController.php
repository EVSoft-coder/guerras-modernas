<?php

namespace App\Http\Controllers;

use App\Application\SendMission;
use App\Models\Base;
use App\Models\FarmingTemplate;
use App\Models\Relatorio;
use App\Models\UnitType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FarmingController extends Controller
{
    private SendMission $sendMission;

    public function __construct(SendMission $sendMission)
    {
        $this->sendMission = $sendMission;
    }

    /**
     * Listar alvos próximos e modelos de farming.
     */
    public function index()
    {
        $jogador = Auth::user();
        $currentBase = $jogador->bases()->first(); // Base de referência para distância

        if (!$currentBase) {
            return redirect()->route('dashboard')->with('error', 'Precisas de uma base para aceder ao Assistente de Farming.');
        }

        $templates = FarmingTemplate::where('jogador_id', $jogador->id)->get();
        $unitTypes = UnitType::all();

        // 1. Encontrar bases bárbaras próximas (Raio de 50 chunks)
        $nearbyNpcs = Base::whereNull('jogador_id')
            ->whereBetween('coordenada_x', [$currentBase->coordenada_x - 50, $currentBase->coordenada_x + 50])
            ->whereBetween('coordenada_y', [$currentBase->coordenada_y - 50, $currentBase->coordenada_y + 50])
            ->get()
            ->map(function ($npc) use ($currentBase, $jogador) {
                // Calcular distância
                $dist = sqrt(pow($npc->coordenada_x - $currentBase->coordenada_x, 2) + pow($npc->coordenada_y - $currentBase->coordenada_y, 2));
                
                // Buscar último relatório
                $lastReport = Relatorio::where('destino_base_id', $npc->id)
                    ->where('atacante_id', $jogador->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $resources = null;
                if ($lastReport && isset($lastReport->detalhes['resources'])) {
                    $resources = $lastReport->detalhes['resources'];
                } elseif ($lastReport && isset($lastReport->detalhes['recursos_vistos'])) {
                    $resources = $lastReport->detalhes['recursos_vistos'];
                }

                return [
                    'id' => $npc->id,
                    'nome' => $npc->nome,
                    'x' => $npc->coordenada_x,
                    'y' => $npc->coordenada_y,
                    'distancia' => round($dist, 1),
                    'last_report' => $lastReport ? [
                        'id' => $lastReport->id,
                        'vitoria' => $lastReport->vencedor_id === $jogador->id,
                        'created_at' => $lastReport->created_at,
                        'resources' => $resources
                    ] : null
                ];
            })
            ->sortBy('distancia')
            ->values();

        return Inertia::render('Premium/Farming', [
            'templates' => $templates,
            'targets' => $nearbyNpcs,
            'unitTypes' => $unitTypes,
            'currentBaseId' => $currentBase->id
        ]);
    }

    /**
     * Criar ou atualizar um modelo de farming.
     */
    public function storeTemplate(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:50',
            'unidades' => 'required|array'
        ]);

        FarmingTemplate::updateOrCreate(
            ['jogador_id' => Auth::id(), 'nome' => $request->nome],
            ['unidades' => $request->unidades]
        );

        return back()->with('success', 'Modelo de farming guardado.');
    }

    /**
     * Enviar ataque rápido usando um modelo.
     */
    public function attack(Request $request)
    {
        $request->validate([
            'target_id' => 'required|exists:bases,id',
            'template_id' => 'required|exists:farming_templates,id',
            'origin_id' => 'required|exists:bases,id'
        ]);

        $jogador = Auth::user();
        $template = FarmingTemplate::where('id', $request->template_id)
            ->where('jogador_id', $jogador->id)
            ->firstOrFail();

        $data = [
            'origem_id' => $request->origin_id,
            'destino_id' => $request->target_id,
            'tipo' => 'ataque',
            'tropas' => $template->unidades
        ];

        try {
            $this->sendMission->execute($jogador, $data);
            return response()->json(['status' => 'success', 'message' => 'Tropas enviadas!']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
        }
    }
}
