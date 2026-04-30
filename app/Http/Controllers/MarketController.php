<?php
 
namespace App\Http\Controllers;
 
use App\Models\MarketOffer;
use App\Models\Base;
use App\Services\ResourceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
 
class MarketController extends Controller
{
    protected $resourceService;
 
    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
    }
 
    /**
     * Lista as ofertas do mercado.
     */
    public function index()
    {
        $offers = MarketOffer::with('base.jogador')
            ->where('status', 'open')
            ->latest()
            ->get();
            
        return response()->json($offers);
    }
 
    /**
     * Cria uma nova oferta.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'base_id' => 'required|exists:bases,id',
            'offered_resource' => 'required|string',
            'offered_amount' => 'required|numeric|min:1',
            'requested_resource' => 'required|string',
            'requested_amount' => 'required|numeric|min:1',
        ]);
 
        $user = Auth::user();
        $base = $user->bases()->findOrFail($data['base_id']);
 
        return DB::transaction(function() use ($base, $data) {
            // Sincronizar e verificar recursos
            $this->resourceService->syncResources($base);
            $recursos = $base->recursos;
 
            if ($recursos->{$data['offered_resource']} < $data['offered_amount']) {
                throw new \Exception("MERCADO: Recursos insuficientes para criar a oferta.");
            }
 
            // Deduzir recursos da base
            $recursos->decrement($data['offered_resource'], $data['offered_amount']);
 
            $offer = MarketOffer::create([
                'base_id' => $base->id,
                'offered_resource' => $data['offered_resource'],
                'offered_amount' => $data['offered_amount'],
                'requested_resource' => $data['requested_resource'],
                'requested_amount' => $data['requested_amount'],
                'status' => 'open',
            ]);
 
            return response()->json(['status' => 'success', 'message' => 'Oferta publicada no Hub Global.']);
        });
    }
 
    /**
     * Aceita uma oferta.
     */
    public function accept(Request $request, $id)
    {
        $data = $request->validate([
            'base_id' => 'required|exists:bases,id',
        ]);
 
        $user = Auth::user();
        $base = $user->bases()->findOrFail($data['base_id']);
        $offer = MarketOffer::where('status', 'open')->findOrFail($id);
 
        if ($offer->base_id === $base->id) {
            throw new \Exception("MERCADO: Não podes aceitar a tua própria oferta.");
        }
 
        return DB::transaction(function() use ($base, $offer) {
            // Sincronizar e verificar recursos (quem aceita paga o solicitado)
            $this->resourceService->syncResources($base);
            $recursos = $base->recursos;
 
            if ($recursos->{$offer->requested_resource} < $offer->requested_amount) {
                throw new \Exception("MERCADO: Recursos insuficientes para aceitar a oferta.");
            }
 
            // 1. Quem aceita paga o solicitado
            $recursos->decrement($offer->requested_resource, $offer->requested_amount);
            
            // 2. Quem aceita recebe o oferecido
            $recursos->increment($offer->offered_resource, $offer->offered_amount);
 
            // 3. Quem criou a oferta recebe o solicitado (atómico)
            $originBase = Base::findOrFail($offer->base_id);
            $this->resourceService->syncResources($originBase);
            $originBase->recursos->increment($offer->requested_resource, $offer->requested_amount);
 
            // 4. Fechar oferta
            $offer->update(['status' => 'accepted']);
 
            return response()->json(['status' => 'success', 'message' => 'Troca concluída. Recursos transferidos.']);
        });
    }
 
    /**
     * Cancela uma oferta.
     */
    public function cancel($id)
    {
        $user = Auth::user();
        $offer = MarketOffer::where('status', 'open')->findOrFail($id);
        
        $base = $user->bases()->findOrFail($offer->base_id);
 
        return DB::transaction(function() use ($base, $offer) {
            // Devolver recursos
            $base->recursos->increment($offer->offered_resource, $offer->offered_amount);
            
            $offer->update(['status' => 'cancelled']);
 
            return response()->json(['status' => 'success', 'message' => 'Oferta cancelada e recursos devolvidos.']);
        });
    }

    /**
     * Envia recursos para outra base (Logística).
     */
    public function send(Request $request)
    {
        $data = $request->validate([
            'origin_id' => 'required|exists:bases,id',
            'target_x' => 'required|numeric',
            'target_y' => 'required|numeric',
            'suprimentos' => 'nullable|numeric|min:0',
            'combustivel' => 'nullable|numeric|min:0',
            'municoes' => 'nullable|numeric|min:0',
            'metal' => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        $origin = $user->bases()->findOrFail($data['origin_id']);
        
        $target = Base::where('coordenada_x', $data['target_x'])
            ->where('coordenada_y', $data['target_y'])
            ->first();

        if (!$target) {
            throw new \Exception("LOGÍSTICA: Coordenadas de destino inválidas.");
        }

        if ($target->id === $origin->id) {
            throw new \Exception("LOGÍSTICA: Não podes enviar recursos para a mesma base.");
        }

        return DB::transaction(function() use ($origin, $target, $data) {
            app(ResourceService::class)->syncResources($origin);
            $rec = $origin->recursos;
            
            $totalPayload = 0;
            $resourcesToSend = ['suprimentos', 'combustivel', 'municoes', 'metal'];
            
            foreach ($resourcesToSend as $res) {
                $amount = (int)($data[$res] ?? 0);
                if ($amount > 0) {
                    if ($rec->{$res} < $amount) {
                        throw new \Exception("LOGÍSTICA: Suprimentos de " . strtoupper($res) . " insuficientes.");
                    }
                    $totalPayload += $amount;
                }
            }

            if ($totalPayload <= 0) {
                throw new \Exception("LOGÍSTICA: Define a quantidade de recursos a enviar.");
            }

            $gameService = new GameService();
            $marketLevel = $gameService->obterNivelEdificio($origin, 'mercado');
            $merchantsTotal = $marketLevel;
            
            $merchantsBusy = Movement::where('origin_id', $origin->id)
                ->where('type', 'transporte')
                ->where('status', 'moving')
                ->count();

            if (($merchantsBusy + ceil($totalPayload / 1000)) > $merchantsTotal) {
                throw new \Exception("LOGÍSTICA: Comerciantes insuficientes. Nível de Mercado: {$marketLevel}.");
            }

            foreach ($resourcesToSend as $res) {
                $amount = (int)($data[$res] ?? 0);
                if ($amount > 0) {
                    $rec->decrement($res, $amount);
                }
            }

            $distancia = sqrt(pow($target->coordenada_x - $origin->coordenada_x, 2) + pow($target->coordenada_y - $origin->coordenada_y, 2));
            $segundosViajem = 60 + ($distancia * 10);

            Movement::create([
                'origin_id' => $origin->id,
                'target_id' => $target->id,
                'type' => 'transporte',
                'status' => 'moving',
                'departure_time' => now(),
                'arrival_time' => now()->addSeconds($segundosViajem),
                'loot_suprimentos' => $data['suprimentos'] ?? 0,
                'loot_combustivel' => $data['combustivel'] ?? 0,
                'loot_municoes' => $data['municoes'] ?? 0,
                'loot_metal' => $data['metal'] ?? 0,
            ]);

            return response()->json(['status' => 'success', 'message' => "Comboio logístico enviado para {$target->nome}."]);
        });
    }

    /**
     * Lista os movimentos logísticos ativos da base.
     */
    public function movements(Request $request)
    {
        $baseId = $request->query('base_id');
        if (!$baseId) {
            return response()->json([]);
        }

        $user = Auth::user();
        $base = $user->bases()->findOrFail($baseId);

        $movements = \App\Models\Movement::with(['origin', 'target'])
            ->where(function($query) use ($base) {
                $query->where('origin_id', $base->id)
                      ->orWhere('target_id', $base->id);
            })
            ->where('type', 'transporte')
            ->where('status', 'moving')
            ->get();

        return response()->json($movements);
    }
}
