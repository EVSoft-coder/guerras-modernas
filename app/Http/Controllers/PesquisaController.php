<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Services\ResearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
 
class PesquisaController extends Controller
{
    protected $researchService;
 
    public function __construct(ResearchService $researchService)
    {
        $this->researchService = $researchService;
    }
 
    /**
     * Inicia uma pesquisa tecnológica.
     */
    public function pesquisar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'tech' => 'required|string'
        ]);
 
        $jogador = Auth::user();

        try {
            DB::transaction(function() use ($request, $jogador) {
                $base = Base::where('id', $request->base_id)->lockForUpdate()->firstOrFail();
                $this->authorize('update', $base);

                $this->researchService->pesquisar($jogador, $base, $request->tech);
            });
            return redirect()->back()->with('success', "CENTRO DE PESQUISA: Protótipos de " . strtoupper($request->tech) . " em desenvolvimento.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
