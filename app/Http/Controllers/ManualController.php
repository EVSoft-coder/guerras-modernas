<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ManualController extends Controller
{
    public function index()
    {
        $units = config('game.units');
        $buildings = config('game.buildings');
        
        return \Inertia\Inertia::render('manual', compact('units', 'buildings'));
    }
}
