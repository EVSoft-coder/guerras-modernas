@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-md-9">
            <!-- VOLTAR -->
            <div class="mb-4">
                <a href="{{ route('dashboard') }}" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
                    <i class="bi bi-arrow-left me-1"></i> Voltar ao Centro de Comando
                </a>
            </div>

            <!-- CABEÇALHO DO RELATÓRIO -->
            <div class="card bg-dark border-secondary rounded-4 shadow-lg mb-4 glassmorphism overflow-hidden">
                <div class="p-4 {{ $relatorio->vencedor_id === Auth::id() ? 'bg-success/10 border-bottom border-success/30' : 'bg-danger/10 border-bottom border-danger/30' }}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="badge {{ $relatorio->vencedor_id === Auth::id() ? 'bg-success' : 'bg-danger' }} text-uppercase mb-2 px-3 py-2">
                                <i class="bi {{ $relatorio->vencedor_id === Auth::id() ? 'bi-check-circle-fill' : 'bi-x-circle-fill' }} me-1"></i>
                                {{ $relatorio->vencedor_id === Auth::id() ? 'Vitória Tática' : 'Derrota Operacional' }}
                            </span>
                            <h2 class="text-white fw-bold mb-0">{{ $relatorio->titulo }}</h2>
                            <p class="text-muted mb-0 small mt-1">Registo Oficial de Combate: #{{ $relatorio->id }} | {{ \Carbon\Carbon::parse($relatorio->created_at)->format('d/m/Y H:i:s') }}</p>
                        </div>
                        <div class="text-end d-none d-md-block">
                            <i class="bi {{ $relatorio->vencedor_id === Auth::id() ? 'bi-shield-check text-success' : 'bi-shield-exclamation text-danger' }} display-4 opacity-50"></i>
                        </div>
                    </div>
                </div>

                <div class="card-body p-4">
                    <div class="row align-items-center text-center">
                        <div class="col-5">
                            <div class="text-uppercase x-small fw-bold text-muted mb-2 ls-1">Atacante</div>
                            <div class="fs-5 fw-bold text-white">{{ $relatorio->origem_nome }}</div>
                            @if($relatorio->atacante_id === Auth::id())
                                <span class="badge bg-primary/20 text-primary x-small">Nós</span>
                            @endif
                        </div>
                        <div class="col-2">
                            <div class="text-muted fs-4 fw-bold">VS</div>
                        </div>
                        <div class="col-5">
                            <div class="text-uppercase x-small fw-bold text-muted mb-2 ls-1">Defensor</div>
                            <div class="fs-5 fw-bold text-white">{{ $relatorio->destino_nome }}</div>
                            @if($relatorio->defensor_id === Auth::id())
                                <span class="badge bg-primary/20 text-primary x-small">Nós</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- CONTEÚDO DINÂMICO BASEADO NO TIPO -->
            @if(isset($relatorio->detalhes['tipo']) && $relatorio->detalhes['tipo'] === 'espionagem')
                <div class="row g-4">
                    <!-- INTELIGÊNCIA: TROPA -->
                    <div class="col-md-6">
                        <div class="card bg-dark border-info/30 rounded-4 h-100 glassmorphism">
                            <div class="card-header bg-info/5 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-info fw-bold"><i class="bi bi-person-bounding-box me-2"></i> Forças Terrestres Identificadas</h6>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-dark mb-0">
                                    <thead class="x-small text-muted text-uppercase">
                                        <tr><th class="px-4">Divisão</th><th class="text-end px-4">Contingente</th></tr>
                                    </thead>
                                    <tbody>
                                        @forelse($relatorio->detalhes['tropas'] as $unid => $qtd)
                                            <tr>
                                                <td class="px-4 py-3 text-white fw-bold small">{{ $unid }}</td>
                                                <td class="px-4 py-3 text-end text-info fw-black small">{{ number_format($qtd) }}</td>
                                            </tr>
                                        @empty
                                            <tr><td colspan="2" class="p-4 text-center text-muted small italic">Sem tropas detetadas.</td></tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- INTELIGÊNCIA: LOGÍSTICA -->
                    <div class="col-md-6">
                        <div class="card bg-dark border-warning/30 rounded-4 h-100 glassmorphism">
                            <div class="card-header bg-warning/5 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-warning fw-bold"><i class="bi bi-hdd-network me-2"></i> Stock de Recursos Detetado</h6>
                            </div>
                            <div class="card-body p-4">
                                @foreach($relatorio->detalhes['recursos'] as $res => $qtd)
                                    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-white/5 pb-2">
                                        <span class="text-muted text-uppercase small fw-bold">{{ $res }}</span>
                                        <span class="text-white fw-black">{{ number_format($qtd) }}</span>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    <!-- INTELIGÊNCIA: INFRAESTRUTURA -->
                    <div class="col-12">
                        <div class="card bg-dark border-secondary rounded-4 glassmorphism">
                            <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-white fw-bold"><i class="bi bi-building me-2"></i> Infraestrutura Prioritária</h6>
                            </div>
                            <div class="card-body p-4">
                                <div class="row g-4">
                                    @foreach($relatorio->detalhes['edificios'] as $tipo => $nivel)
                                        <div class="col-6 col-md-3 text-center">
                                            <div class="p-3 rounded-4 bg-white/5 border border-white/10">
                                                <div class="text-muted x-small text-uppercase fw-bold mb-1">{{ str_replace('_', ' ', $tipo) }}</div>
                                                <div class="text-info fw-black fs-4">LVL {{ $nivel }}</div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <div class="row g-4">
                    <!-- LOGÍSTICA DE SAQUE -->
                    <div class="col-md-12">
                        <div class="card bg-dark border-secondary rounded-4 h-100 glassmorphism">
                            <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-white fw-bold"><i class="bi bi-box-seam text-warning me-2"></i> Logística de Saque</h6>
                            </div>
                            <div class="card-body p-4">
                                @if(isset($relatorio->detalhes['saque']) && array_sum($relatorio->detalhes['saque']) > 0)
                                    <div class="row text-center g-3">
                                        @foreach($relatorio->detalhes['saque'] as $res => $valor)
                                            <div class="col-md-4">
                                                <div class="p-3 rounded-4 bg-white/5 border border-white/10">
                                                    <div class="text-uppercase x-small fw-bold text-muted mb-1">{{ $res }}</div>
                                                    <div class="fs-4 fw-bold text-success">+{{ number_format($valor, 0, ',', '.') }}</div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <div class="text-center py-3 text-muted italic">
                                        <i class="bi bi-slash-circle me-1"></i> Nenhum recurso saqueado nesta operação.
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- TABELA DE COMBATE (BAIXAS) -->
                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary rounded-4 h-100 glassmorphism">
                            <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-white fw-bold"><i class="bi bi-person-x text-danger me-2"></i> Baixas Atacante</h6>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-dark table-hover mb-0">
                                    <thead>
                                        <tr class="x-small text-muted text-uppercase">
                                            <th class="px-3">Unidade</th>
                                            <th class="text-center">Enviadas</th>
                                            <th class="text-center">Perdidas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($relatorio->detalhes['tropas_atacante_antes'] ?? [] as $unidade => $qtdAntes)
                                            @php
                                                $perdidas = $qtdAntes - ($relatorio->detalhes['tropas_atacante_depois'][$unidade] ?? 0);
                                            @endphp
                                            <tr>
                                                <td class="px-3 fw-bold text-white small">{{ $unidade }}</td>
                                                <td class="text-center small">{{ $qtdAntes }}</td>
                                                <td class="text-center small {{ $perdidas > 0 ? 'text-danger' : 'text-success' }}">-{{ $perdidas }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card bg-dark border-secondary rounded-4 h-100 glassmorphism">
                            <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                                <h6 class="mb-0 text-white fw-bold"><i class="bi bi-shield-x text-info me-2"></i> Baixas Defensor</h6>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-dark table-hover mb-0">
                                    <thead>
                                        <tr class="x-small text-muted text-uppercase">
                                            <th class="px-3">Unidade</th>
                                            <th class="text-center">Total</th>
                                            <th class="text-center">Perdidos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($relatorio->detalhes['tropas_defensor_antes'] ?? [] as $unidade => $qtdAntes)
                                            @php
                                                $perdidas = $qtdAntes - ($relatorio->detalhes['tropas_defensor_depois'][$unidade] ?? 0);
                                            @endphp
                                            <tr>
                                                <td class="px-3 fw-bold text-white small">{{ $unidade }}</td>
                                                <td class="text-center small">{{ $qtdAntes }}</td>
                                                <td class="text-center small {{ $perdidas > 0 ? 'text-danger' : 'text-success' }}">-{{ $perdidas }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>

<style>
.ls-1 { letter-spacing: 1px; }
.x-small { font-size: 0.75rem; }
.glassmorphism {
    background: rgba(30,30,30, 0.8) !important;
    backdrop-filter: blur(10px);
}
</style>
@endsection
