@extends('layouts.app')

@section('content')
<div class="row g-4 justify-content-center">
    <!-- CONTROLES DO MAPA -->
    <div class="col-12 text-center mb-2">
        <h3 class="fw-bold"><i class="bi bi-radar"></i> Centro de Comando Tático</h3>
        <div class="badge bg-dark border border-white/10 p-2 fs-6">
             Frequência: <span class="text-success blink">ATIVA</span> | Coords: {{ $x }},{{ $y }}
        </div>
    </div>

    <!-- MAPA GRID -->
    <div class="col-auto">
        <div class="tactical-map-container shadow-2xl rounded-4 overflow-hidden border border-white/5 p-4" 
             style="background: #020617;">
            
            <div class="map-grid position-relative" style="display: grid; grid-template-columns: repeat(13, 45px); gap: 2px;">
                <div class="scanner-line" style="animation-duration: 3s; opacity: 0.2;"></div>
                @for ($iy = $y - 6; $iy <= $y + 6; $iy++)
                    @for ($ix = $x - 6; $ix <= $x + 6; $ix++)
                        @php 
                            $baseAqui = $bases->where('coordenada_x', $ix)->where('coordenada_y', $iy)->first(); 
                            $aliancaId = Auth::user()->alianca_id;
                            $tipoIcone = 'enemy';
                            if ($baseAqui) {
                                if ($baseAqui->jogador_id == Auth::id()) $tipoIcone = 'owner';
                                elseif ($aliancaId && $baseAqui->jogador->alianca_id == $aliancaId) $tipoIcone = 'ally';
                            }
                        @endphp
                        
                        <div class="map-tile d-flex align-items-center justify-content-center position-relative" 
                             style="width: 45px; height: 45px; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.03);"
                             title="({{ $ix }}, {{ $iy }}) {{ $baseAqui ? $baseAqui->nome : 'Setor Vazio' }}">
                            
                            @if ($baseAqui)
                                <div class="base-icon {{ $tipoIcone }}"
                                     data-bs-toggle="popover" 
                                     data-bs-title="{{ $baseAqui->nome }} [{{ $baseAqui->jogador->alianca->tag ?? 'S/A' }}]"
                                     data-bs-content="Comandante: {{ $baseAqui->jogador->username }}<br>Nível Base: {{ $baseAqui->qg_nivel }}<br><a href='{{ route('dashboard') }}?target={{ $baseAqui->id }}' class='btn btn-sm btn-danger mt-2 w-100 fw-bold'>ORDENS DE ATAQUE</a>"
                                     data-bs-html="true">
                                    @if ($tipoIcone == 'owner')
                                        <i class="bi bi-shield-fill text-info"></i>
                                    @elseif ($tipoIcone == 'ally')
                                        <i class="bi bi-shield-shaded text-primary"></i>
                                    @else
                                        <i class="bi bi-house-door-fill text-danger"></i>
                                    @endif
                                </div>
                            @else
                                <span class="small text-white/5" style="font-size: 8px;">.</span>
                            @endif

                            <div class="tile-coords-label">{{ $ix }},{{ $iy }}</div>
                        </div>
                    @endfor
                @endfor
            </div>
        </div>
    </div>

    <!-- PAINEL LATERAL -->
    <div class="col-md-3">
        <div class="card bg-dark/50 border-white/5 rounded-4 shadow-sm h-100">
            <div class="card-body">
                <h6 class="text-uppercase small text-muted mb-3">Legenda Operativa</h6>
                <div class="d-flex align-items-center mb-3">
                    <div class="tile-sample me-3 bg-info rounded-1" style="width: 20px; height: 20px;"></div>
                    <span>Tua Jurisdição</span>
                </div>
                <div class="d-flex align-items-center mb-3">
                    <div class="tile-sample me-3 bg-danger rounded-1" style="width: 20px; height: 20px;"></div>
                    <span>Forças Hostis</span>
                </div>
                <div class="d-flex align-items-center mb-4">
                    <div class="tile-sample me-3 bg-dark border border-white/10 rounded-1" style="width: 20px; height: 20px;"></div>
                    <span>Terreno Neutro</span>
                </div>
                
                <hr class="border-white/5">
                
                <form action="{{ route('mapa') }}" method="GET" class="mt-4">
                    <div class="mb-3">
                        <label class="form-label small text-muted">Acesso Coordenado (X,Y)</label>
                        <div class="input-group input-group-sm">
                            <input type="number" name="x" value="{{ $x }}" class="form-control bg-dark border-white/10 text-white">
                            <input type="number" name="y" value="{{ $y }}" class="form-control bg-dark border-white/10 text-white">
                            <button class="btn btn-primary" type="submit">IR</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .map-tile:hover { background: rgba(56, 189, 248, 0.1) !important; cursor: crosshair; }
    .tile-coords-label { position: absolute; font-size: 6px; bottom: 2px; right: 2px; color: rgba(255,255,255,0.05); }
    .base-icon { transition: transform 0.2s; cursor: pointer; font-size: 20px; }
    .base-icon:hover { transform: scale(1.3); }
    .base-icon.owner { filter: drop-shadow(0 0 5px #0ea5e9); }
    .base-icon.ally { filter: drop-shadow(0 0 5px #3b82f6); }
    .base-icon.enemy { filter: drop-shadow(0 0 5px #ef4444); }
    
    .blink { animation: blink-animation 2s steps(5, start) infinite; -webkit-animation: blink-animation 2s steps(5, start) infinite; }
    @keyframes blink-animation { to { visibility: hidden; } }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })
    })
</script>
@endsection
