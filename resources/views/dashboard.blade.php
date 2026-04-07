@extends('layouts.app')

@section('content')
<div class="row g-4">
    <!-- BARRA DE RECURSOS -->
    <div class="col-12">
        <div class="d-flex justify-content-around align-items-center p-3 rounded-4 shadow-lg border border-white/10" 
             style="background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);">
            
            <div class="text-center px-3 border-end border-white/5">
                <div class="text-muted small text-uppercase fw-bold">📦 Suprimentos</div>
                <div class="fs-4 fw-bold text-white" id="res-suprimentos">{{ number_format($base->recursos->suprimentos) }}</div>
            </div>
            
            <div class="text-center px-3 border-end border-white/5">
                <div class="text-muted small text-uppercase fw-bold">⛽ Combustível</div>
                <div class="fs-4 fw-bold text-warning" id="res-combustivel">{{ number_format($base->recursos->combustivel) }}</div>
            </div>
            
            <div class="text-center px-3 border-end border-white/5">
                <div class="text-muted small text-uppercase fw-bold">🚀 Munições</div>
                <div class="fs-4 fw-bold text-danger" id="res-municoes">{{ number_format($base->recursos->municoes) }}</div>
            </div>
            
            <div class="text-center px-3">
                <div class="text-muted small text-uppercase fw-bold">👥 Pessoal</div>
                <div class="fs-4 fw-bold text-info" id="res-pessoal">{{ number_format($base->recursos->pessoal) }}</div>
            </div>
        </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toastContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>

    <!-- INFORMAÇÕES DA BASE E RELATÓRIOS -->
    <div class="col-md-4">
        <!-- BASE INFO -->
        <div class="card bg-dark border-secondary rounded-4 shadow-sm mb-4 overflow-hidden">
            <div class="card-header border-bottom border-white/5 pt-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-truncate">📍 {{ $base->nome }}</h5>
                @if($bases->count() > 1)
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-info dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown">
                            Trocar Base
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark shadow-xl border-white/10">
                            @foreach($bases as $b)
                                <li>
                                    <a class="dropdown-item @if($b->id == $base->id) active @endif" href="{{ route('base.switch', $b->id) }}">
                                        {{ $b->nome }} ({{ $b->coordenada_x }}|{{ $b->coordenada_y }})
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Coordenadas:</span>
                    <span class="fw-bold text-info">({{ $base->coordenada_x }}|{{ $base->coordenada_y }})</span>
                </div>
                <hr class="border-white/10">
                <div class="mt-3">
                    <h6 class="text-uppercase x-small text-muted mb-3 fw-bold">Infraestrutura</h6>
                    <div class="mb-2 d-flex justify-content-between">
                        <span class="small">🏢 QG</span>
                        <span class="badge bg-primary rounded-pill">Nivel {{ $base->qg_nivel }}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small">🛡️ Muralha</span>
                        <span class="badge bg-secondary rounded-pill">Nivel {{ $base->muralha_nivel }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ATAQUES EM CURSO -->
        @php 
            $ataquesEnviados = \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get();
            $ataquesRecebidos = \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get();
        @endphp

        <div class="card bg-dark border-danger/20 rounded-4 shadow-sm mb-4">
            <div class="card-header border-bottom border-white/5 pt-3">
                <h6 class="mb-0 text-danger fw-bold"><i class="bi bi-broadcast-pin"></i> Movimentos de Tropas</h6>
            </div>
            <div class="card-body p-2">
                @forelse($ataquesRecebidos as $atq)
                    <div class="p-2 mb-2 rounded bg-danger/10 border border-danger/20 small">
                        ⚠️ <strong>ALERTA:</strong> Ataque hostil a chegar em <span class="text-danger fw-bold">{{ $atq->chegada_em->diffForHumans() }}</span>
                    </div>
                @empty
                    <div class="p-2 text-center text-muted small">Sem ameaças imediatas detectadas.</div>
                @endforelse
                
                @foreach($ataquesEnviados as $atq)
                    <div class="p-2 mb-2 rounded bg-info/10 border border-info/20 small">
                        🚢 Missão em curso para base destino. Chegada em {{ $atq->chegada_em->diffForHumans() }}
                    </div>
                @endforeach
            </div>
        </div>

        <!-- RELATÓRIOS RECENTES -->
        <div class="card bg-dark border-white/5 rounded-4 shadow-sm">
            <div class="card-header border-bottom border-white/5 pt-3">
                <h6 class="mb-0"><i class="bi bi-file-earmark-text"></i> Inteligência Recente</h6>
            </div>
            <div class="card-body p-0" style="max-height: 300px; overflow-y: auto;">
                <div class="list-group list-group-flush">
                    @forelse($relatorios as $rel)
                        <a href="{{ route('relatorio.show', $rel->id) }}" class="list-group-item list-group-item-action bg-transparent border-white/5 p-3 text-decoration-none">
                            <div class="d-flex justify-content-between align-items-start">
                                <span class="small fw-bold {{ $rel->vencedor_id == Auth::id() ? 'text-success' : 'text-danger' }}">
                                    {{ $rel->vencedor_id == Auth::id() ? '[VITÓRIA]' : '[DERROTA]' }}
                                </span>
                                <span class="x-small text-muted">{{ $rel->created_at->format('d M - H:i') }}</span>
                            </div>
                            <div class="small mt-1 text-white/80">{{ $rel->titulo }}</div>
                            @if($rel->vencedor_id == Auth::id() && isset($rel->detalhes['saque']))
                                <div class="x-small text-success mt-1">
                                    💰 Saque: +{{ array_sum($rel->detalhes['saque']) }} recursos
                                </div>
                            @endif
                        </a>
                    @empty
                        <div class="p-4 text-center text-muted small">Sem relatórios de combate.</div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>

    <!-- EDIFÍCIOS E FILAS -->
    <div class="col-md-8">
        <div class="card bg-dark border-secondary rounded-4 shadow-sm mb-4">
             <div class="card-header border-bottom border-white/5 pt-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0">🏗️ Engenharia & Construções</h5>
                @if($base->construcoes->count() > 0)
                    <span class="badge bg-warning text-dark animate-pulse">Obras em curso...</span>
                @endif
            </div>
            <div class="card-body p-0">
                <table class="table table-dark table-hover mb-0">
                    <thead>
                        <tr class="text-muted small">
                            <th class="ps-4">Tipo</th>
                            <th>Nível</th>
                            <th class="text-end pe-4">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $tiposDisponiveis = ['mina_suprimentos', 'refinaria', 'fabrica_municoes', 'posto_recrutamento', 'quartel', 'aerodromo']; @endphp
                        @foreach($tiposDisponiveis as $tipo)
                            @php $ed = $base->edificios->where('tipo', $tipo)->first(); @endphp
                            <tr class="align-middle">
                                <td class="ps-4 text-capitalize">
                                    {{ str_replace('_', ' ', $tipo) }}
                                </td>
                                <td><span class="text-info font-monospace">{{ $ed ? $ed->nivel : 0 }}</span></td>
                                <td class="text-end pe-4">
                                    <form action="{{ route('base.upgrade') }}" method="POST">
                                        @csrf
                                        <input type="hidden" name="base_id" value="{{ $base->id }}">
                                        <input type="hidden" name="tipo" value="{{ $tipo }}">
                                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-glow" 
                                                {{ $base->construcoes->count() > 0 ? 'disabled' : '' }}>
                                            Upgrade
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TROPAS E TREINO -->
        <div class="card bg-dark border-secondary rounded-4 shadow-sm">
            <div class="card-header border-bottom border-white/5 pt-3">
                <h5 class="mb-0">🪖 Guarnição Militar</h5>
            </div>
            <div class="card-body p-0">
                <table class="table table-dark table-hover mb-0">
                    <thead>
                        <tr class="text-muted small">
                            <th class="ps-4">Unidade</th>
                            <th>Quantidade</th>
                            <th class="text-end pe-4">Recrutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(config('game.units') as $key => $unit)
                        @php $t = $base->tropas->where('unidade', $key)->first(); @endphp
                        <tr class="align-middle">
                            <td class="ps-4"><strong>{{ $unit['name'] }}</strong></td>
                            <td><span class="text-success fw-bold">{{ $t ? $t->quantidade : 0 }}</span></td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-success rounded-pill px-3" 
                                        onclick="abrirTreino('{{ $key }}', '{{ $unit['name'] }}')">
                                    + Recrutar
                                </button>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- MODAL TREINO -->
<div class="modal fade" id="modalTreino" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white border-white/10 rounded-4 shadow-xl" style="backdrop-filter: blur(20px);">
            <div class="modal-header border-white/5">
                <h5 class="modal-title" id="treinoTitle">Recrutar Unidade</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('base.treinar') }}" method="POST">
                @csrf
                <input type="hidden" name="base_id" value="{{ $base->id }}">
                <input type="hidden" name="unidade" id="treinoUnidade">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label text-muted">Quantidade de unidades:</label>
                        <input type="number" name="quantidade" class="form-control bg-dark border-white/10 text-white shadow-inner" value="1" min="1">
                    </div>
                    <div id="costDisplay" class="small text-muted p-3 rounded bg-black/20 border border-white/5">
                        <!-- Custos aparecem via JS -->
                    </div>
                </div>
                <div class="modal-footer border-white/5 text-center d-block">
                    <button type="submit" class="btn btn-success rounded-pill px-5 shadow-lg">CONFIRMAR ORDENS</button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1) !important; }
    .table-dark { --bs-table-bg: transparent; }
    .animate-pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    .shadow-glow:hover { box-shadow: 0 0 15px rgba(14, 165, 233, 0.4); }
</style>

<script>
    function abrirTreino(key, name) {
        document.getElementById('treinoUnidade').value = key;
        document.getElementById('treinoTitle').innerText = 'Recrutar: ' + name;
        new bootstrap.Modal(document.getElementById('modalTreino')).show();
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} shadow-lg border-0 mb-2`;
        toast.style.minWidth = '250px';
        toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    function updateResources(res) {
        document.getElementById('res-suprimentos').innerText = Number(res.suprimentos).toLocaleString();
        document.getElementById('res-combustivel').innerText = Number(res.combustivel).toLocaleString();
        document.getElementById('res-municoes').innerText = Number(res.municoes).toLocaleString();
        document.getElementById('res-pessoal').innerText = Number(res.pessoal).toLocaleString();
    }

    document.addEventListener('submit', function(e) {
        const action = e.target.getAttribute('action');
        if (action && (action.includes('upgrade') || action.includes('treinar'))) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message, 'success');
                    if (data.recursos) updateResources(data.recursos);
                    const mElem = document.getElementById('modalTreino');
                    const m = bootstrap.Modal.getInstance(mElem);
                    if (m) m.hide();
                    
                    // Atualização leve do estado visual (opcional: recarregar após cooldown)
                    setTimeout(() => location.reload(), 2000);
                } else {
                    showToast(data.error || 'Erro na operação.', 'danger');
                }
            })
            .catch(() => showToast('Erro de comunicação tática.', 'danger'))
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        }
    });
</script>
@endsection