<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConstructionTemplate;
use Illuminate\Support\Facades\DB;

class TemplateController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'steps' => 'required|array',
            'steps.*.building_type' => 'required|string',
            'steps.*.target_level' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $template = auth()->user()->constructionTemplates()->create([
                'name' => $request->name
            ]);

            foreach ($request->steps as $index => $step) {
                $template->steps()->create([
                    'building_type' => $step['building_type'],
                    'target_level' => $step['target_level'],
                    'order' => $index
                ]);
            }
        });

        return redirect()->back()->with('success', 'Template criado com sucesso.');
    }

    public function destroy($id)
    {
        $template = auth()->user()->constructionTemplates()->findOrFail($id);
        $template->delete();

        return redirect()->back()->with('success', 'Template removido.');
    }
}
