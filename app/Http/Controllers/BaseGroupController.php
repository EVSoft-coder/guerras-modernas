<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\BaseGroup;
use Illuminate\Http\Request;

class BaseGroupController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        auth()->user()->baseGroups()->create($request->all());

        return redirect()->back()->with('success', 'Grupo criado com sucesso.');
    }

    public function update(Request $request, $id)
    {
        $group = auth()->user()->baseGroups()->findOrFail($id);
        $group->update($request->all());

        return redirect()->back()->with('success', 'Grupo atualizado.');
    }

    public function destroy($id)
    {
        $group = auth()->user()->baseGroups()->findOrFail($id);
        $group->delete();

        return redirect()->back()->with('success', 'Grupo removido.');
    }

    public function assign(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'group_ids' => 'array',
        ]);

        $base = auth()->user()->bases()->findOrFail($request->base_id);
        $base->groups()->sync($request->group_ids);

        return redirect()->back()->with('success', 'Grupos atualizados para a base.');
    }
}
