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
}
