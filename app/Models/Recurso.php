<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Recurso extends Model
{
    protected $table = 'recursos';

    protected $fillable = [
        'base_id',
        'suprimentos',
        'combustivel',
        'municoes',
        'pessoal',
        'metal',
        'energia',
        'cap',
        'updated_at',
    ];

    protected $casts = [
        'suprimentos' => 'double',
        'combustivel' => 'double',
        'municoes' => 'double',
        'metal' => 'double',
        'energia' => 'double',
        'pessoal' => 'double',
        'updated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (self::where('base_id', $model->base_id)->exists()) {
                Log::error('❌ RECURSO_DUPLICADO_NEGADO', [
                    'base_id' => $model->base_id,
                    'trace' => collect(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5))->map(fn($f) => ($f['file'] ?? '?') . ':' . ($f['line'] ?? '?'))->toArray()
                ]);
                return false; // Cancela a criação se já existir
            }

            Log::warning('🔴 RECURSO_CREATING', [
                'base_id' => $model->base_id,
                'data' => $model->toArray(),
            ]);
        });

        static::updating(function ($model) {
            $dirty = $model->getDirty();
            $original = $model->getOriginal();
            Log::warning('🟡 RECURSO_UPDATING', [
                'base_id' => $model->base_id,
                'dirty' => $dirty,
                'original_values' => array_intersect_key($original, $dirty),
                'trace' => collect(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 8))->map(fn($f) => ($f['file'] ?? '?') . ':' . ($f['line'] ?? '?') . ' ' . ($f['function'] ?? '?'))->toArray(),
            ]);
        });

        static::updated(function ($model) {
            Log::info('✅ RECURSO_UPDATED', [
                'base_id' => $model->base_id,
                'final_values' => [
                    'suprimentos' => $model->suprimentos,
                    'combustivel' => $model->combustivel,
                    'municoes' => $model->municoes,
                    'pessoal' => $model->pessoal,
                ],
            ]);
        });
    }

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
