@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <!-- HEADER RANKING -->
            <div class="mb-5 text-center">
                <h1 class="display-4 fw-bold text-white mb-2"><i class="bi bi-trophy text-warning"></i> Ranking Mundial</h1>
                <p class="text-muted text-uppercase small ls-2">Comando Geral de OperaÃ§Ãµes Mundiais</p>
            </div>

            <!-- TABELA DE CLASSIFICAÃ‡ÃƒO -->
            <div class="card bg-dark border-secondary rounded-4 shadow-lg overflow-hidden glassmorphism">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dark table-hover mb-0 align-middle">
                            <thead class="bg-black/40 border-bottom border-white/5">
                                <tr>
                                    <th class="px-4 py-3 text-muted x-small text-uppercase fw-bold" style="width: 80px;">Pos</th>
                                    <th class="px-4 py-3 text-muted x-small text-uppercase fw-bold">General (Jogador)</th>
                                    <th class="px-4 py-3 text-muted x-small text-uppercase fw-bold text-center">Bases</th>
                                    <th class="px-4 py-3 text-muted x-small text-uppercase fw-bold text-end">Pontos Totais</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($jogadores as $index => $j)
                                    <tr class="{{ $j->id === Auth::id() ? 'bg-primary/10 border-start border-primary border-4' : '' }}">
                                        <td class="px-4 py-4">
                                            @if($index == 0)
                                                <span class="badge bg-warning text-dark rounded-circle p-2 shadow-sm"><i class="bi bi-star-fill"></i> 1Âº</span>
                                            @elseif($index == 1)
                                                <span class="badge bg-light text-dark rounded-circle p-2 shadow-sm">2Âº</span>
                                            @elseif($index == 2)
                                                <span class="badge bg-orange text-white rounded-circle p-2 shadow-sm" style="background-color: #cd7f32;">3Âº</span>
                                            @else
                                                <span class="text-muted fw-bold">#{{ $index + 1 }}</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-4">
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-military me-3 text-center d-flex align-items-center justify-content-center">
                                                    <i class="bi bi-person-badge fs-4 text-white/50"></i>
                                                </div>
                                                <div>
                                                    <div class="fw-bold fs-5 {{ $j->id === Auth::id() ? 'text-primary' : 'text-white' }}">
                                                        {{ $j->username }}
                                                        @if($j->alianca)
                                                            <span class="text-info small fw-normal ms-1">[{{ $j->alianca->tag }}]</span>
                                                        @endif
                                                        @if($j->id === Auth::id())
                                                            <span class="badge bg-primary text-uppercase x-small ms-1">Tu</span>
                                                        @endif
                                                    </div>
                                                    <small class="text-muted">Operacional desde {{ \Carbon\Carbon::parse($j->created_at)->format('d/m/Y') }}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-center">
                                            <span class="badge bg-secondary rounded-pill fw-normal px-3 py-2 border border-white/10">
                                                <i class="bi bi-geo-alt-fill text-info me-1"></i> {{ $j->total_bases }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-4 text-end">
                                            <div class="text-white fw-bold fs-4">{{ number_format($j->pontos, 0, ',', '.') }}</div>
                                            <div class="x-small text-uppercase text-muted fw-bold ls-1">Pontos de Comando</div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- NOTA DE PROGRESSÃƒO -->
            <div class="mt-4 p-4 rounded-4 bg-info/5 border border-info/20">
                <div class="d-flex align-items-center">
                    <i class="bi bi-info-circle-fill text-info fs-3 me-3"></i>
                    <div>
                        <h6 class="text-info mb-1 fw-bold text-uppercase small">Cálculo de Prestígio</h6>
                        <p class="text-muted small mb-0">Os pontos sÃ£o calculados com base em: 1 ponto por cada nÃ­vel de edifÃ­cio em todas as tuas bases + bónus de 10 pontos por base controlada.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }
.x-small { font-size: 0.75rem; }
.avatar-military {
    width: 45px;
    height: 45px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
}
.glassmorphism {
    background: rgba(30,30,30, 0.8) !important;
    backdrop-filter: blur(10px);
}
</style>
@endsection

