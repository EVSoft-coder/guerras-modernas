<?php

namespace App\Http\Controllers;

use App\Models\Base;
use App\Services\AcademyService;
use Illuminate\Http\Request;

class AcademyController extends Controller
{
    protected $academyService;

    public function __construct(AcademyService $academyService)
    {
        $this->academyService = $academyService;
    }

    public function mint(Request $request)
    {
        try {
            $baseId = session('selected_base_id');
            $base = Base::where('id', $baseId)
                ->where('jogador_id', auth()->id())
                ->firstOrFail();

            $this->academyService->mintCoin($base);

            return back()->with('success', 'MOEDA CUNHADA: O prestígio da sua aliança cresce.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
