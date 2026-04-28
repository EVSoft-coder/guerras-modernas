<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Base;
use App\Models\BaseGroup;
use App\Models\ConstructionTemplate;
use App\Models\UnitType;
use App\Services\ResourceService;
use Inertia\Inertia;

use App\Services\MassActionService;

class MassCommandController extends Controller
{
    protected $resourceService;
    protected $massActionService;

    protected $movementService;

    public function __construct(ResourceService $resourceService, MassActionService $massActionService, \App\Services\MovementService $movementService)
    {
        $this->resourceService = $resourceService;
        $this->massActionService = $massActionService;
        $this->movementService = $movementService;
    }

    public function index()
    {
        $jogador = auth()->user();
        
        if (!$jogador->ePremium()) {
            return redirect()->route('premium.index')->with('error', 'O acesso ao Alto Comando requer uma Conta Premium ativa.');
        }

        $bases = Base::where('jogador_id', $jogador->id)
            ->with(['recursos', 'edificios', 'units.type', 'groups', 'buildingQueue', 'unitQueue', 'movements', 'incomingMovements'])
            ->get();

        $basesData = $bases->map(function ($base) {
            return [
                'id' => $base->id,
                'nome' => $base->nome,
                'coordenadas' => "{$base->coordenada_x}|{$base->coordenada_y}",
                'resources' => $this->resourceService->calculateResources($base),
                'buildings' => $base->edificios->map(fn($b) => [
                    'tipo' => $b->tipo,
                    'nivel' => $b->nivel
                ]),
                'units' => $base->units->map(fn($u) => [
                    'type_id' => $u->unit_type_id,
                    'quantity' => $u->quantity
                ]),
                'groups' => $base->groups->pluck('id'),
                'queues' => [
                    'buildings' => $base->buildingQueue->count(),
                    'units' => $base->unitQueue->count()
                ],
                'movements' => [
                    'outgoing' => $base->movements->where('status', 'moving')->count(),
                    'incoming' => $base->incomingMovements->where('status', 'moving')->count()
                ],
                'reinforcements' => \App\Models\Reinforcement::where('target_base_id', $base->id)
                    ->with('type', 'originBase.jogador')
                    ->get()
                    ->map(fn($r) => [
                        'id' => $r->id,
                        'origin_base' => $r->originBase->nome,
                        'jogador' => $r->originBase->jogador->nome ?? 'Desconhecido',
                        'unit_name' => $r->type->display_name ?? $r->type->name,
                        'quantity' => $r->quantity
                    ]),
                'my_supports' => \App\Models\Reinforcement::where('origin_base_id', $base->id)
                    ->with('type', 'targetBase.jogador')
                    ->get()
                    ->map(fn($r) => [
                        'id' => $r->id,
                        'target_base' => $r->targetBase->nome,
                        'jogador' => $r->targetBase->jogador->nome ?? 'Desconhecido',
                        'unit_name' => $r->type->display_name ?? $r->type->name,
                        'quantity' => $r->quantity
                    ])
            ];
        });

        $playerHistory = \App\Models\PlayerStat::where('jogador_id', $jogador->id)
            ->orderBy('recorded_at', 'asc')
            ->take(14)
            ->get();

        $allianceHistory = [];
        if ($jogador->alianca_id) {
            $allianceHistory = \App\Models\AllianceStat::where('alianca_id', $jogador->alianca_id)
                ->orderBy('recorded_at', 'asc')
                ->take(14)
                ->get();
        }

        return Inertia::render('CommandCenter/Index', [
            'bases' => $basesData,
            'unitTypes' => UnitType::all(),
            'groups' => BaseGroup::where('jogador_id', $jogador->id)->get(),
            'templates' => ConstructionTemplate::where('jogador_id', $jogador->id)->with('steps')->get(),
            'playerHistory' => $playerHistory,
            'allianceHistory' => $allianceHistory
        ]);
    }

    public function recruitMass(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
        ]);

        $results = $this->massActionService->recruitMass(auth()->user(), $request->orders);

        return redirect()->back()->with('success', 'Ordens de recrutamento em massa processadas.');
    }

    public function applyTemplate(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:construction_templates,id',
            'base_ids' => 'required|array',
        ]);

        $template = auth()->user()->constructionTemplates()->findOrFail($request->template_id);
        $this->massActionService->applyTemplate(auth()->user(), $template, $request->base_ids);

        return redirect()->back()->with('success', 'Template aplicado às bases selecionadas.');
    }
    public function recallReinforcement($id)
    {
        $reinforcement = \App\Models\Reinforcement::findOrFail($id);
        $jogador = auth()->user();
        
        // Verificar se o jogador é o dono das tropas ou o dono da base onde estão
        $originBase = \App\Models\Base::find($reinforcement->origin_base_id);
        $targetBase = \App\Models\Base::find($reinforcement->target_base_id);
        
        if ($originBase->jogador_id !== $jogador->id && $targetBase->jogador_id !== $jogador->id) {
            abort(403);
        }

        // Criar movimento de retorno (usando tipo 'ataque' para a própria base é seguro)
        $units = [[
            'id' => $reinforcement->unit_type_id,
            'quantity' => $reinforcement->quantity
        ]];

        $this->movementService->sendTroops(
            $targetBase, 
            $originBase, 
            $units, 
            'ataque'
        );
        
        $reinforcement->delete();

        return redirect()->back()->with('success', 'Tropas em marcha de regresso.');
    }
}
