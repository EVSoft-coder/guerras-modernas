<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UnitQueueService;
use App\Models\Base;
use Illuminate\Support\Facades\Auth;

class UnitRecruitmentController extends Controller
{
    private \App\Application\TrainUnits $trainUnits;

    private \App\Application\TrainUnits $trainUnits;
    private UnitQueueService $queueService;

    public function __construct(\App\Application\TrainUnits $trainUnits, UnitQueueService $queueService)
    {
        $this->trainUnits = $trainUnits;
        $this->queueService = $queueService;
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
    public function cancel(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\UnitQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->cancelRecruitment($id);
            return redirect()->back()->with('success', 'MOBILIZAÇÃO ABORTADA: Recursos devolvidos para o stock.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function moveUp(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\UnitQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->moveUp($id);
            return redirect()->back()->with('success', 'PRIORIDADE ALTERADA: Unidades movidas na fila.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function moveDown(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\UnitQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->moveDown($id);
            return redirect()->back()->with('success', 'PRIORIDADE ALTERADA: Unidades movidas na fila.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
