<?php

namespace App\Http\Controllers;

use App\Application\SendMission;
use App\Application\CancelMission;
use App\Models\Ataque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * AtaqueController - Controller "Magra" (Lean).
 */
class AtaqueController extends Controller
{
    private SendMission $sendMission;
    private CancelMission $cancelMission;

    public function __construct(SendMission $sendMission, CancelMission $cancelMission)
    {
        $this->sendMission = $sendMission;
        $this->cancelMission = $cancelMission;
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
            'tipo' => 'required|string|in:ataque,espionagem,conquista,reforco,transporte',
            'suprimentos' => 'nullable|numeric',
            'combustivel' => 'nullable|numeric',
            'municoes' => 'nullable|numeric',
            'metal' => 'nullable|numeric',
            'energia' => 'nullable|numeric',
            'pessoal' => 'nullable|numeric',
            'general_id' => 'nullable|exists:generais,id',
        ]);

        try {
            $this->sendMission->execute(Auth::user(), $data);
            if ($request->wantsJson()) {
                return response()->json(['status' => 'success', 'message' => "ORDEM DE MARCHA: Operação tática iniciada com sucesso."]);
            }
            return redirect()->back()->with('success', "ORDEM DE MARCHA: Operação tática iniciada com sucesso.");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Cancela uma operação em andamento (se possível).
     */
    public function cancelar($id)
    {
        try {
            $this->cancelMission->execute(Auth::user(), $id);
            return redirect()->back()->with('success', 'MISSÃO ABORTADA: Tropas regressaram à base.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
