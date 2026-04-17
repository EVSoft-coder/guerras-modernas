<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UnitQueueService;
use App\Models\Base;
use Illuminate\Support\Facades\Auth;

class UnitRecruitmentController extends Controller
{
    private \App\Application\TrainUnits $trainUnits;

    public function __construct(\App\Application\TrainUnits $trainUnits)
    {
        $this->trainUnits = $trainUnits;
    }

    /**
     * Endpoint para recrutamento de unidades.
     * PASSO 6 - recruit
     */
    public function recruit(Request $request)
    {
        $request->validate([
            'unit_type_id' => 'required|exists:unit_types,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $baseId = session('selected_base_id');
        
        $base = $baseId 
            ? Base::where('jogador_id', $user->id)->findOrFail($baseId)
            : Base::where('jogador_id', $user->id)->first();

        $this->authorize('update', $base);

        try {
            $this->trainUnits->execute(
                $user, 
                $base->id, 
                $request->unit_type_id, 
                $request->quantity
            );

            return redirect()->back()->with('success', 'Ordens de mobilização enviadas ao quartel!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
