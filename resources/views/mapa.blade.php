@extends('layouts.app')

@section('content')
<div class="row g-4 justify-content-center">
    <!-- CONTROLES DO MAPA -->
    <div class="col-12 text-center mb-2">
        <h3 class="fw-bold"><i class="bi bi-radar"></i> Centro de Comando T&aacute;tico</h3>
        <div class="badge bg-dark border border-white/10 p-2 fs-6">
             Frequ&ecirc;ncia: <span class="text-success blink">ATIVA</span> | Coords: {{ $x }},{{ $y }}
        </div>
    </div>

    <!-- MAPA GRID E NAVEGAÇÃO -->
    <div class="col-auto">
        <div class="tactical-map-outer d-flex flex-column align-items-center">
            
            <!-- NORTE -->
            <a href="{{ route('mapa', ['x' => $x, 'y' => $y - 10]) }}" class="btn btn-outline-info btn-xs mb-2 rounded-pill px-4 fw-black">
                <i class="bi bi-chevron-double-up me-2"></i> NORTE
            </a>

            <div class="d-flex align-items-center gap-2">
                <!-- OESTE -->
                <a href="{{ route('mapa', ['x' => $x - 10, 'y' => $y]) }}" class="btn btn-outline-info btn-xs rounded-pill p-2">
                    <i class="bi bi-chevron-double-left"></i>
                </a>

                <div class="tactical-map-container shadow-2xl rounded-4 overflow-hidden border border-white/5 p-4" 
                     style="background: #020617; box-shadow: 0 0 50px rgba(14, 165, 233, 0.1);">
                    
                    <div class="map-grid position-relative" style="display: grid; grid-template-columns: repeat(13, 45px); gap: 2px;">
                        <div class="scanner-sweep"></div>
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
                                     data-bs-content="Comandante: {{ $baseAqui->jogador->username }}<br>N&iacute;vel Base: {{ $baseAqui->qg_nivel }}<br><a href='{{ route('dashboard') }}?target={{ $baseAqui->id }}' class='btn btn-sm btn-danger mt-2 w-100 fw-bold'>ORDENS DE ATAQUE</a>"
                                     data-bs-html="true">
                                    @if ($tipoIcone == 'owner')
                                        <i class="bi bi-hexagon-fill text-info"></i>
                                    @elseif ($tipoIcone == 'ally')
                                        <i class="bi bi-hexagon-half text-primary"></i>
                                    @else
                                        <i class="bi bi-hexagon text-danger"></i>
                                    @endif
                                </div>
                            @else
                                <span class="small text-white/5" style="font-size: 8px;">.</span>
                            @endif

                            <div class="tile-coords-label">{{ $ix }},{{ $iy }}</div>
                        </div>
                    @endfor
                @endfor
                <!-- ESTE -->
                <a href="{{ route('mapa', ['x' => $x + 10, 'y' => $y]) }}" class="btn btn-outline-info btn-xs rounded-pill p-2">
                    <i class="bi bi-chevron-double-right"></i>
                </a>
            </div>

            <!-- SUL -->
            <a href="{{ route('mapa', ['x' => $x, 'y' => $y + 10]) }}" class="btn btn-outline-info btn-xs mt-2 rounded-pill px-4 fw-black">
                <i class="bi bi-chevron-double-down me-2"></i> SUL
            </a>
        </div>
    </div>

    <!-- PAINEL LATERAL -->
    <div class="col-md-3">
        <div class="card bg-dark/50 border-white/5 rounded-4 shadow-sm h-100">
            <div class="card-body">
                <h6 class="text-uppercase small text-muted mb-3 italic">Assinaturas de Radar</h6>
                <div class="d-flex align-items-center mb-3">
                    <div class="tile-sample me-3 rounded-1 shadow-sm" style="width: 20px; height: 20px; background-color: #0ea5e9;"></div>
                    <span class="small fw-bold">Tua Jurisdi&ccedil;&atilde;o</span>
                </div>
                <div class="d-flex align-items-center mb-3">
                    <div class="tile-sample me-3 rounded-1 shadow-sm" style="width: 20px; height: 20px; background-color: #3b82f6;"></div>
                    <span class="small fw-bold">Aliados / Coliga&ccedil;&atilde;o</span>
                </div>
                <div class="d-flex align-items-center mb-4">
                    <div class="tile-sample me-3 rounded-1 shadow-sm" style="width: 20px; height: 20px; background-color: #ef4444;"></div>
                    <span class="small fw-bold">For&ccedil;as Hostis</span>
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
    .map-tile { transition: background 0.1s; }
    .map-tile:hover { background: rgba(56, 189, 248, 0.15) !important; cursor: crosshair; }
    .tile-coords-label { position: absolute; font-size: 6px; bottom: 2px; right: 2px; color: rgba(255,255,255,0.08); font-family: 'JetBrains Mono', monospace; }
    
    .base-icon { transition: all 0.2s; cursor: pointer; font-size: 20px; z-index: 5; }
    .base-icon:hover { transform: scale(1.4) rotate(5deg); }
    .base-icon.owner { color: #0ea5e9; filter: drop-shadow(0 0 8px #0ea5e9); }
    .base-icon.ally { color: #3b82f6; filter: drop-shadow(0 0 8px #3b82f6); }
    .base-icon.enemy { color: #ef4444; filter: drop-shadow(0 0 8px #ef4444); }
    
    .scanner-sweep {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 2px;
        background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
        box-shadow: 0 0 15px #0ea5e9;
        opacity: 0.3;
        z-index: 10;
        animation: scan 4s linear infinite;
    }
    
    @keyframes scan {
        0% { top: 0; }
        100% { top: 100%; }
    }

    .blink { animation: blink-animation 2s steps(5, start) infinite; }
    @keyframes blink-animation { to { visibility: hidden; } }
    
    .popover { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(14, 165, 233, 0.3); backdrop-filter: blur(10px); color: white; }
    .popover-header { background: rgba(14, 165, 233, 0.1); border-bottom: 1px solid rgba(14, 165, 233, 0.2); color: #0ea5e9; font-weight: 900; text-transform: uppercase; }
    .popover-body { color: rgba(255,255,255,0.8); }
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
