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

    public function __construct(ResourceService $resourceService, MassActionService $massActionService)
    {
        $this->resourceService = $resourceService;
        $this->massActionService = $massActionService;
    }

    public function index()
    {
        $jogador = auth()->user();
        
        $bases = Base::where('jogador_id', $jogador->id)
            ->with(['recursos', 'edificios', 'units.type', 'groups', 'buildingQueue', 'unitQueue'])
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
                ]
            ];
        });

        return Inertia::render('CommandCenter/Index', [
            'bases' => $basesData,
            'unitTypes' => UnitType::all(),
            'groups' => BaseGroup::where('jogador_id', $jogador->id)->get(),
            'templates' => ConstructionTemplate::where('jogador_id', $jogador->id)->with('steps')->get()
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
}
