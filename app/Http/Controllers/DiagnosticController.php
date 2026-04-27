<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Movement;
use App\Models\Base;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DiagnosticController extends Controller
{
    public function check()
    {
        $status = [
            'database' => 'OK',
            'counts' => [
                'messages' => Mensagem::count(),
                'movements' => Movement::count(),
                'active_movements' => Movement::where('status', 'moving')->count(),
                'processed_movements' => Movement::whereNotNull('processed_at')->count(),
            ],
            'recent_messages' => Mensagem::latest()->take(5)->get(),
            'recent_movements' => Movement::latest()->take(5)->with('units')->get(),
            'server_time' => now()->toDateTimeString(),
            'php_version' => PHP_VERSION,
        ];

        return response()->json($status);
    }

    public function fixHungMovements()
    {
        $fixed = Movement::where('status', 'moving')
            ->where('arrival_time', '<=', now())
            ->whereNull('processed_at')
            ->update(['arrival_time' => now()->subMinutes(1)]);

        return response()->json(['fixed_count' => $fixed]);
    }
}
