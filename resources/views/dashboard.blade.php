@extends('layouts.app')

@section('content')
<div class="row g-4">
    <!-- HUD DE RECURSOS - ALTO CONTRASTE -->
    <div class="col-12">
        <div class="glassmorphism rounded-4 p-4 shadow-lg border border-white/20 animate-glow">
            <div class="row g-4 text-center">
                <div class="col-6 col-md-3 border-end border-white/10">
                    <div class="text-info small text-uppercase fw-bold mb-1 ls-1">📦 Suprimentos</div>
                    <div class="res-value text-white d-flex align-items-center justify-content-center mb-0" id="res-suprimentos">
                        {{ number_format(floor($base->recursos->suprimentos)) }}
                    </div>
                    <div class="x-small text-info opacity-80 fw-bold mt-1" id="rate-suprimentos">+{{ number_format($taxas['suprimentos']) }} p/min</div>
                </div>
                <div class="col-6 col-md-3 border-end border-white/10">
                    <div class="text-warning small text-uppercase fw-bold mb-1 ls-1">⛽ Combustível</div>
                    <div class="res-value text-warning d-flex align-items-center justify-content-center mb-0" id="res-combustivel">
                        {{ number_format(floor($base->recursos->combustivel)) }}
                    </div>
                    <div class="x-small text-warning opacity-80 fw-bold mt-1" id="rate-combustivel">+{{ number_format($taxas['combustivel']) }} p/min</div>
                </div>
                <div class="col-6 col-md-3 border-end border-white/10">
                    <div class="text-danger small text-uppercase fw-bold mb-1 ls-1">🚀 Munições</div>
                    <div class="res-value text-danger d-flex align-items-center justify-content-center mb-0" id="res-municoes">
                        {{ number_format(floor($base->recursos->municoes)) }}
                    </div>
                    <div class="x-small text-danger opacity-80 fw-bold mt-1" id="rate-municoes">+{{ number_format($taxas['municoes']) }} p/min</div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="text-success small text-uppercase fw-bold mb-1 ls-1">👥 Pessoal</div>
                    <div class="res-value text-success d-flex align-items-center justify-content-center mb-0" id="res-pessoal">
                        {{ number_format(floor($base->recursos->pessoal)) }}
                    </div>
                    <div class="x-small text-success opacity-80 fw-bold mt-1" id="rate-pessoal">+{{ number_format($taxas['pessoal']) }} p/min</div>
                </div>
            </div>
        </div>
    </div>

    <!-- AREA VISUAL DA ALDEIA (VILLAGE VIEW LIKE TRIBAL WARS) -->
    <div class="col-12">
        <div class="village-view shadow-2xl glint" style="background-image: url('{{ asset('images/base_view.png') }}');">
            <div class="scanner-line"></div>
            <div class="village-overlay">
                <div class="d-flex justify-content-between align-items-end">
                    <div>
                        <span class="badge bg-primary px-3 rounded-pill text-uppercase mb-2">Comando Geral</span>
                        <h2 class="text-white fw-black display-5 mb-0" style="text-shadow: 0 4px 15px rgba(0,0,0,0.8);">{{ $base->nome }}</h2>
                        <p class="text-info fw-bold mb-0">
                            COORDENADAS TÁTICAS: <span class="badge bg-black/40 border border-info/30 fs-6">({{ $base->coordenada_x }}|{{ $base->coordenada_y }})</span>
                            @if(strtolower(Auth::user()->username ?? Auth::user()->name) == 'admin' || Auth::id() == 1)
                                <a href="{{ route('cron.processar') }}" class="btn btn-xs btn-outline-warning rounded-pill x-small ms-3 fw-bold">
                                    <i class="bi bi-gear-fill"></i> SINCRONIZAR GUERRA
                                </a>
                            @endif
                        </p>
                    </div>
                    <div class="text-end">
                        @if($base->construcoes->count() > 0)
                            @php $c = $base->construcoes->first(); @endphp
                            <div class="glassmorphism p-3 rounded-4 border-warning/40 animate-pulse">
                                <div class="text-warning x-small fw-bold text-uppercase mb-1">Engenharia em Curso</div>
                                <div class="fs-3 fw-black text-white countdown" data-time="{{ $c->completado_em->timestamp }}">--:--</div>
                                <div class="x-small text-white/70">{{ $c->edificio_tipo }} Nível {{ $c->nivel_destino }}</div>
                            </div>
                        @else
                            <div class="glassmorphism p-3 rounded-4 border-success/40">
                                <div class="text-success x-small fw-bold text-uppercase">Logística</div>
                                <div class="text-white small">Sistemas Operacionais</div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- INFO DA BASE E RELATÓRIOS -->
    <div class="col-lg-4">
        <!-- BASE SWITCHER & STATUS -->
        <div class="card glassmorphism border-white/10 mb-4 h-auto">
            <div class="card-header border-white/5 py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-white fw-bold"><i class="bi bi-geo-alt-fill text-primary"></i> Território Ativo</h6>
                @if($bases->count() > 1)
                    <div class="dropdown">
                        <button class="btn btn-xs btn-outline-info dropdown-toggle rounded-pill x-small px-3" type="button" data-bs-toggle="dropdown">
                            MUDAR BASE
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark shadow-2xl border-white/10">
                            @foreach($bases as $b)
                                <li>
                                    <a class="dropdown-item py-2 @if($b->id == $base->id) active @endif" href="{{ route('base.switch', $b->id) }}">
                                        {{ $b->nome }} <span class="text-muted fs-7">({{ $b->coordenada_x }}|{{ $b->coordenada_y }})</span>
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </div>
            <div class="card-body py-4">
                <div class="d-flex justify-content-between mb-3 border-bottom border-white/5 pb-2">
                    <span class="text-muted small">Quartel General:</span>
                    <span class="badge bg-primary/20 text-info border border-info/30">NIVEL {{ $base->qg_nivel }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted small">Fortificações:</span>
                    <span class="badge bg-secondary/20 text-white border border-white/30">NIVEL {{ $base->muralha_nivel }}</span>
                </div>
            </div>
        </div>

        <!-- MOVIMENTOS MILITARES -->
        @php 
            $ataquesEnviados = \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get();
            $ataquesRecebidos = \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get();
        @endphp

        <div class="card glassmorphism border-danger/30 mb-4 h-auto">
            <div class="card-header border-white/5 py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-danger fw-bold"><i class="bi bi-broadcast"></i> Inteligência de Campanha</h6>
                <span class="badge bg-danger/20 text-danger x-small border border-danger/30">OPERACIONAL</span>
            </div>
            <div class="card-body p-2">
                @forelse($ataquesRecebidos as $atq)
                    <div class="p-3 mb-2 rounded-3 bg-danger/20 border border-danger/40 animate-pulse">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-danger small">HOSTIL DETECTADO!</strong>
                            <span class="badge bg-danger countdown x-small" data-time="{{ $atq->chegada_em->timestamp }}">--:--</span>
                        </div>
                        <div class="x-small text-white mt-1">Impacto iminente em {{ $atq->chegada_em->format('H:i:s') }}</div>
                    </div>
                @empty
                    <div class="p-4 text-center text-muted small py-5">
                       <i class="bi bi-shield-check display-6 mb-2 d-block opacity-20"></i>
                       Espaço Aéreo Seguro.
                    </div>
                @endforelse
                
                @foreach($ataquesEnviados as $atq)
                    <div class="p-3 mb-2 rounded-3 bg-info/10 border border-info/30">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong class="text-info small">MISSÃO EXPEDICIONÁRIA</strong>
                            <span class="badge bg-info countdown x-small" data-time="{{ $atq->chegada_em->timestamp }}">--:--</span>
                        </div>
                        <div class="x-small text-white/70 mt-1">Destino: Base Hostil ({{ $atq->tipo }})</div>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- GLOBAL WAR FEED (TOP LEVEL FEATURE) -->
        <div class="card glassmorphism border-info/20 mb-4 h-auto overflow-hidden">
            <div class="card-header bg-info/5 border-bottom border-white/5 py-3">
                <h6 class="mb-0 text-info fw-bold text-uppercase ls-1 x-small"><i class="bi bi-globe me-2"></i> Feed de Guerra Global</h6>
            </div>
            <div class="card-body p-0" id="globalFeed" style="max-height: 300px; overflow-y: auto;">
                @forelse($relatoriosGlobal as $r)
                    <div class="p-3 border-bottom border-white/5 bg-hover-white/5 transition-all">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <span class="fw-bold text-white x-small">{{ $r->titulo }}</span>
                            <span class="text-muted x-small" style="font-size: 0.6rem;">{{ $r->created_at->diffForHumans() }}</span>
                        </div>
                        <div class="text-muted x-small opacity-80">
                            {{ $r->origem_nome }} <i class="bi bi-chevron-right mx-1"></i> {{ $r->destino_nome }}
                        </div>
                    </div>
                @empty
                    <div class="p-4 text-center text-muted small py-5">
                        <p class="mb-0">Aguardando comunicações de satélite...</p>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- ÚLTIMAS OPERAÇÕES (RELATÓRIOS PESSOAIS) -->
        <div class="card glassmorphism border-white/10 mb-4 h-auto">
            <div class="card-header border-white/5 py-3">
                <h6 class="mb-0 text-white fw-bold x-small text-uppercase ls-1"><i class="bi bi-journal-text text-warning"></i> Histórico de Operações</h6>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush">
                    @forelse($relatorios as $rel)
                        <a href="{{ route('relatorio.show', $rel->id) }}" class="list-group-item list-group-item-action bg-transparent border-white/5 py-3 transition-all bg-hover-white/5">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="fw-bold text-white x-small">{{ $rel->titulo }}</div>
                                    <div class="text-muted" style="font-size: 0.6rem;">{{ $rel->created_at->format('d/m/Y H:i') }} | Op. #{{ $rel->id }}</div>
                                </div>
                                <div class="text-end">
                                    @if($rel->vencedor_id == Auth::id())
                                        <span class="badge bg-success/10 text-success border border-success/20 x-small px-2">VITÓRIA</span>
                                    @else
                                        <span class="badge bg-danger/10 text-danger border border-danger/20 x-small px-2">DERROTA</span>
                                    @endif
                                </div>
                            </div>
                        </a>
                    @empty
                        <div class="p-4 text-center text-muted py-5" style="font-size: 0.65rem;">
                            SEM OPERAÇÕES REGISTADAS
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>

    <!-- EDIFÍCIOS E ENGENHARIA -->
    <div class="col-lg-8">
        <div class="card glassmorphism border-white/10 mb-4">
            <div class="card-header border-white/5 py-3">
                <h5 class="mb-0 text-white fw-black text-uppercase ls-1">🏗️ Infraestrutura Militar</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-dark table-hover mb-0 align-middle">
                        <thead class="x-small text-info text-uppercase fw-black ls-1">
                            <tr>
                                <th class="ps-4">Designação Tecnológica</th>
                                <th>Estado</th>
                                <th>Logística Próx. Nível</th>
                                <th class="text-end pe-4">Comando</th>
                            </tr>
                        </thead>
                        <tbody class="text-white">
                            @php 
                                $tiposDisponiveis = ['mina_suprimentos', 'refinaria', 'fabrica_municoes', 'posto_recrutamento', 'quartel', 'aerodromo']; 
                                $scaling = config('game.scaling', 1.5);
                                $bConf = config('game.buildings');
                            @endphp
                            @foreach($tiposDisponiveis as $tipo)
                                @php 
                                    $ed = $base->edificios->where('tipo', $tipo)->first(); 
                                    $nivelAtual = $ed ? $ed->nivel : 0;
                                    $nivelAlvo = $nivelAtual + 1;
                                    $config = $bConf[$tipo] ?? null;
                                @endphp
                                <tr>
                                    <td class="ps-4">
                                        <div class="fw-black fs-5">{{ str_replace('_', ' ', $tipo) }}</div>
                                        <div class="x-small text-info fw-bold opacity-80">{{ $config['name'] ?? '' }}</div>
                                    </td>
                                    <td>
                                        <span class="badge bg-white/10 border border-white/20 fs-6 font-monospace px-3 py-2 text-white">LVL {{ $nivelAtual }}</span>
                                    </td>
                                    <td>
                                        @if($config)
                                            <div class="d-flex flex-wrap gap-2 x-small text-white fw-bold">
                                                @foreach($config['cost'] as $res => $baseAmount)
                                                    @php $finalCost = floor($baseAmount * pow($nivelAlvo, $scaling)); @endphp
                                                    <span class="badge @if($res == 'suprimentos') bg-white/5 text-info @elseif($res == 'combustivel') bg-warning/10 text-warning @elseif($res == 'municoes') bg-danger/10 text-danger @else bg-success/10 text-success @endif border border-white/5">
                                                        {{ number_format($finalCost) }}
                                                    </span>
                                                @endforeach
                                                <span class="badge bg-info/10 text-info border border-info/20">🕒 {{ ($config['time_base'] * $nivelAlvo) / config('game.speed.construction', 1) }}s</span>
                                            </div>
                                        @endif
                                    </td>
                                    <td class="text-end pe-4">
                                        <form action="{{ route('base.upgrade') }}" method="POST" class="ajax-form">
                                            @csrf
                                            <input type="hidden" name="base_id" value="{{ $base->id }}">
                                            <input type="hidden" name="tipo" value="{{ $tipo }}">
                                            <button type="submit" class="btn btn-primary rounded-4 px-4 py-2 text-uppercase fs-7 fw-black @if($base->construcoes->count() > 0) opacity-30 @endif" 
                                                    {{ $base->construcoes->count() > 0 ? 'disabled' : '' }}>
                                                UPGRADE
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- RECRUTAMENTO DE TROPAS -->
        <div class="card glassmorphism border-white/10">
            <div class="card-header border-white/5 py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-white fw-black text-uppercase ls-1">🪖 Guarnição Defensiva</h5>
                @if($base->treinos->count() > 0)
                    @php $tr = $base->treinos->first(); @endphp
                    <div class="badge bg-success/20 border border-success/40 text-success py-2 px-3 animate-pulse">
                         <span class="countdown fw-black" data-time="{{ $tr->completado_em->timestamp }}">--:--</span>
                         <span class="ms-2 small">{{ $tr->unidade }}</span>
                    </div>
                @endif
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-dark table-hover mb-0 align-middle">
                        <thead class="x-small text-success text-uppercase fw-black ls-1">
                            <tr>
                                <th class="ps-4">Divisão Militar</th>
                                <th>Contingente</th>
                                <th>Custos Mob.</th>
                                <th class="text-end pe-4">Recrutar</th>
                            </tr>
                        </thead>
                        <tbody class="text-white">
                            @foreach(config('game.units') as $key => $unit)
                            @php $t = $base->tropas->where('unidade', $key)->first(); @endphp
                            <tr>
                                <td class="ps-4">
                                    <div class="fw-black fs-5">{{ $unit['name'] }}</div>
                                    <div class="d-flex gap-2 x-small text-muted mt-1">
                                        <span>ATK: <span class="text-danger fw-bold">{{ $unit['attack'] }}</span></span>
                                        <span>DEF: <span class="text-success fw-bold">{{ $unit['defense_general'] }}</span></span>
                                    </div>
                                </td>
                                <td><span class="badge bg-success text-dark fs-5 fw-black px-3">{{ $t ? $t->quantidade : 0 }}</span></td>
                                <td>
                                    <div class="d-flex flex-wrap gap-2 x-small text-white fw-bold">
                                        @foreach($unit['cost'] as $res => $amount)
                                            <span class="badge bg-white/5 border border-white/10">
                                                {{ number_format($amount) }}
                                            </span>
                                        @endforeach
                                        <span class="badge bg-info/10 text-info border border-info/20">🕒 {{ $unit['time'] / config('game.speed.training', 1) }}s</span>
                                    </div>
                                </td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-outline-success border-2 rounded-4 px-4 py-2 fs-7 fw-black text-uppercase" 
                                            onclick="abrirTreino('{{ $key }}', '{{ $unit['name'] }}')">
                                        MOBILIZAR
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
</div>

<!-- TOAST CONTAINER -->
<div id="toastContainer" class="position-fixed top-0 end-0 p-4" style="z-index: 10000;"></div>

<!-- MODAL TREINO - TÁTICO -->
<div class="modal fade" id="modalTreino" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content glassmorphism border-white/20 text-white rounded-5 shadow-2xl p-2">
            <div class="modal-header border-0">
                <h5 class="modal-title fw-black text-uppercase ls-1" id="treinoTitle">ORDENS DE RECRUTAMENTO</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form action="{{ route('base.treinar') }}" method="POST" class="ajax-form">
                @csrf
                <input type="hidden" name="base_id" value="{{ $base->id }}">
                <input type="hidden" name="unidade" id="treinoUnidade">
                <div class="modal-body py-4">
                    <label class="form-label text-info fw-bold small text-uppercase mb-3">Quantidade de Unidades para Mobilizar</label>
                    <input type="number" name="quantidade" class="form-control form-control-lg bg-black/40 border-white/20 text-white fw-black rounded-4 text-center fs-2 mb-4" value="1" min="1">
                    
                    <div class="bg-white/5 p-4 rounded-4 border border-white/10">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small text-muted">Capacidade Logística:</span>
                            <span class="text-success fw-bold">VERIFICADA ✅</span>
                        </div>
                        <p class="x-small text-muted mb-0">As tropas serão treinadas sequencialmente e adicionadas à sua guarnição defensiva.</p>
                    </div>
                </div>
                <div class="p-3">
                    <button type="submit" class="btn btn-success btn-lg w-100 rounded-4 py-3 fw-black text-uppercase ls-1 shadow-lg">EMITIR ORDENS DE COMBATE</button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .ls-1 { letter-spacing: 1px; }
    .x-small { font-size: 0.72rem; }
    .fs-7 { font-size: 0.8rem; }
    .display-5 { font-weight: 900; }
    .animate-pulse { animation: pulse-red 2s infinite; }
    @keyframes pulse-red { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
    
    .dropdown-item.active { background-color: var(--primary); }
    .table-hover tbody tr:hover { background: rgba(255,255,255,0.06); }
    
    /* Scrollbar Design Moderno */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-main); }
    ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
</style>

<script>
    // SISTEMA DE CONTAGEM REGRESSIVA + ALERTAS SONOROS
    function initCountdowns() {
        setInterval(() => {
            document.querySelectorAll('.countdown').forEach(el => {
                const target = parseInt(el.getAttribute('data-time'));
                const now = Math.floor(Date.now() / 1000);
                const diff = target - now;

                if (diff <= 0) {
                    if (!el.classList.contains('concluido')) {
                        el.innerHTML = '<span class="text-success blink">CONFIRMADO</span>';
                        el.classList.add('concluido');
                        playSuccessSound();
                        showToast('ORDENS CONCLUÍDAS: ' + (el.nextElementSibling ? el.nextElementSibling.innerText : 'Logística'), 'info');
                        setTimeout(() => location.reload(), 3000);
                    }
                    return;
                }

                const m = Math.floor(diff / 60);
                const s = diff % 60;
                el.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            });
        }, 1000);
    }

    function playSuccessSound() {
        const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => {});
    }
    
    document.addEventListener('DOMContentLoaded', initCountdowns);

    function abrirTreino(key, name) {
        document.getElementById('treinoUnidade').value = key;
        document.getElementById('treinoTitle').innerText = 'ORDEM: ' + name;
        new bootstrap.Modal(document.getElementById('modalTreino')).show();
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `glassmorphism p-4 rounded-4 shadow-2xl mb-3 animate-glow d-flex align-items-center border-${type}`;
        toast.style.minWidth = '300px';
        toast.style.borderLeft = `5px solid var(--${type})`;
        toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill fs-4 me-3 text-${type}"></i> <div class="fw-bold text-white">${message}</div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    function updateHUDResources(res) {
        document.getElementById('res-suprimentos').innerText = Math.floor(res.suprimentos).toLocaleString();
        document.getElementById('res-combustivel').innerText = Math.floor(res.combustivel).toLocaleString();
        document.getElementById('res-municoes').innerText = Math.floor(res.municoes).toLocaleString();
        document.getElementById('res-pessoal').innerText = Math.floor(res.pessoal).toLocaleString();
    }

    // INTERCEPTOR AJAX PARA ORDENS RÁPIDAS
    document.querySelectorAll('.ajax-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]') || this.querySelector('button');
            const original = btn ? btn.innerHTML : '...';
            if(btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            }

            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(r => r.json())
            .then(data => {
                if(data.success) {
                    showToast(data.message, 'success');
                    if(data.recursos) updateHUDResources(data.recursos);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalTreino'));
                    if(modal) modal.hide();
                    setTimeout(() => location.reload(), 2000);
                } else {
                    showToast(data.error || 'Falha no Comando.', 'danger');
                    btn.disabled = false;
                    btn.innerHTML = original;
                }
            })
            .catch(() => {
                showToast('Erro de Conexão Crítico.', 'danger');
                btn.disabled = false;
                btn.innerHTML = original;
            });
        });
    });
</script>
@endsection