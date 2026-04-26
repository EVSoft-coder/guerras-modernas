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
            'destino_id' => 'nullable', // Validação manual abaixo para maior flexibilidade
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

        // Normalizar destino_id (evitar "0" ou strings vazias)
        if (empty($data['destino_id']) || $data['destino_id'] == 0) {
            $data['destino_id'] = null;
        }

        \Illuminate\Support\Facades\Log::info('[ATAQUE_DEBUG] Dados Recebidos:', $data);

        try {
            $this->sendMission->execute(Auth::user(), $data);
            if ($request->wantsJson()) {
                return response()->json(['status' => 'success', 'message' => "ORDEM DE MARCHA: Operação tática iniciada com sucesso."]);
            }
            return redirect()->back()->with('success', "ORDEM DE MARCHA: Operação tática iniciada com sucesso.");
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             if ($request->wantsJson()) {
                return response()->json(['status' => 'error', 'message' => "ESTRUTURA INEXISTENTE: A base de destino (ID: ".$data['destino_id'].") não foi encontrada no mapa tático."], 422);
            }
            return redirect()->back()->withErrors(['error' => "Base não encontrada."]);
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
