<?php

namespace App\Http\Controllers;

use App\Services\GeneralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GeneralController extends Controller
{
    protected $generalService;

    public function __construct(GeneralService $generalService)
    {
        $this->generalService = $generalService;
    }

    public function index()
    {
        $jogador = Auth::user();
        $general = $jogador->general()->with('skills')->first();

        return Inertia::render('General/Index', [
            'general' => $general,
            'skillsDisponiveis' => $this->generalService->getAvailableSkills(),
            'xpNextLevel' => $this->generalService->getXpForNextLevel($general->nivel),
        ]);
    }

    public function upgradeSkill(Request $request)
    {
        $request->validate(['skill' => 'required|string']);
        
        $jogador = Auth::user();
        $general = $jogador->general;

        if ($this->generalService->upgradeSkill($general, $request->skill)) {
            return redirect()->back()->with('success', 'Especialização militar atualizada.');
        }

        return redirect()->back()->withErrors(['error' => 'Não é possível evoluir esta competência.']);
    }

    public function rename(Request $request)
    {
        $request->validate(['nome' => 'required|string|max:50']);
        
        $general = Auth::user()->general;
        $general->nome = $request->nome;
        $general->save();

        return redirect()->back()->with('success', 'Codinome do General atualizado.');
    }
}
