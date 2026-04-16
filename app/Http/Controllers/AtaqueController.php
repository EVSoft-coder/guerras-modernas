<?php

namespace App\Http\Controllers;

use App\Application\SendMission;
use App\Models\Ataque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * AtaqueController - Controller "Magra" (Lean).
 */
class AtaqueController extends Controller
{
    private SendMission $sendMission;

    public function __construct(SendMission $sendMission)
    {
        $this->sendMission = $sendMission;
    }

    /**
     * Envia uma missão militar.
     */
    public function enviar(Request $request)
    {
        $data = $request->validate([
            'origem_id' => 'required|exists:bases,id',
            'destino_id' => 'nullable|exists:bases,id',
            'destino_x' => 'nullable|integer',
            'destino_y' => 'nullable|integer',
            'tropas' => 'required|array',
            'tipo' => 'required|string|in:ataque,espionagem,conquista'
        ]);

        try {
            $this->sendMission->execute(Auth::user(), $data);
            return redirect()->back()->with('success', "ORDEM DE MARCHA: Operação tática iniciada com sucesso.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancela uma operação em andamento (se possível).
     */
    public function cancelar($id)
    {
        $ataque = Ataque::findOrFail($id);
        
        // Authorization check via Policy for the origin base
        $this->authorize('command', $ataque->origem);

        if ($ataque->processado) {
            return redirect()->back()->withErrors(['error' => 'A missão já atingiu o alvo.']);
        }

        try {
            \Illuminate\Support\Facades\DB::transaction(function() use ($ataque) {
                $baseOrigem = $ataque->origem;
                foreach ($ataque->tropas as $unidade => $quantidade) {
                    $baseOrigem->tropas()->where('unidade', $unidade)->increment('quantidade', $quantidade);
                }
                $ataque->delete();
            });
            return redirect()->back()->with('success', 'MISSÃO ABORTADA: Tropas regressaram à base.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
