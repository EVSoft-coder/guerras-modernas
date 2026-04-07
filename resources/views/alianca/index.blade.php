@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="row">
        <!-- INFO GERAL DA ALIANÇA -->
        <div class="col-md-4">
            <div class="card bg-dark border-info/30 rounded-4 shadow-lg glassmorphism mb-4">
                <div class="card-body text-center p-5">
                    <div class="mb-4">
                        <span class="badge bg-info text-dark display-6 p-3 rounded-4 shadow-sm fw-bold">[{{ $alianca->tag }}]</span>
                    </div>
                    <h2 class="text-white fw-bold mb-1">{{ $alianca->nome }}</h2>
                    <p class="text-muted small text-uppercase ls-1">Comando Coligado de Operações</p>
                    
                    <div class="mt-4 p-3 rounded bg-white/5 border border-white/10 text-start">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small">Fundador:</span>
                            <span class="text-white fw-bold">{{ $alianca->fundador->username }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small">Membros:</span>
                            <span class="text-info fw-bold">{{ $alianca->membros->count() }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small">Ponto no Ranking:</span>
                            <span class="text-white">Em breve</span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <form action="{{ route('alianca.sair') }}" method="POST" onsubmit="return confirm('Tem a certeza que deseja sair desta aliança militar?')">
                            @csrf
                            <button type="submit" class="btn btn-outline-danger btn-sm rounded-pill px-4">Sair da Aliança</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- LISTA DE ALIADOS E PEDIDOS -->
        <div class="col-md-8">
            <!-- PEDIDOS DE RECRUTAMENTO (Apenas se for fundador) -->
            @if($alianca->fundador_id === Auth::id() && $alianca->pedidos->where('status', 'pendente')->count() > 0)
                <div class="card bg-dark border-warning/30 rounded-4 shadow-lg glassmorphism mb-4">
                    <div class="card-header bg-warning/10 border-bottom border-warning/20 py-3">
                        <h5 class="mb-0 text-warning fw-bold"><i class="bi bi-person-plus-fill me-2"></i> Candidaturas ao Recrutamento (Pendentes)</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-dark mb-0 align-middle">
                                <thead class="small text-muted text-uppercase fw-bold border-bottom border-white/5">
                                    <tr>
                                        <th class="px-4 py-3">Candidato</th>
                                        <th class="px-4 py-3 text-end">Ação Diplomática</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($alianca->pedidos->where('status', 'pendente') as $p)
                                        <tr>
                                            <td class="px-4 py-3 fw-bold text-white fs-5">{{ $p->jogador->username }}</td>
                                            <td class="px-4 py-3 text-end">
                                                <form action="{{ route('alianca.decidir', [$p->id, 'aprovar']) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-4 fw-bold text-uppercase x-small">Aprovar</button>
                                                </form>
                                                <form action="{{ route('alianca.decidir', [$p->id, 'rejeitar']) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold text-uppercase x-small ms-2">Recusar</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            @endif

            <div class="card bg-dark border-secondary rounded-4 shadow-lg glassmorphism h-100">
                <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                    <h5 class="mb-0 text-white fw-bold"><i class="bi bi-people-fill text-info me-2"></i> Pessoal da Aliança (Aliados)</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dark table-hover mb-0 align-middle">
                            <thead class="bg-black/40 text-muted x-small text-uppercase fw-bold border-bottom border-white/5">
                                <tr>
                                    <th class="px-4 py-3">Câmbio de Comando</th>
                                    <th class="px-4 py-3">Função</th>
                                    <th class="px-4 py-3 text-end">Ingressou em</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($alianca->membros as $m)
                                    <tr>
                                        <td class="px-4 py-4">
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-sm me-3 bg-white/5 rounded p-2 text-center">
                                                    <i class="bi bi-person-badge text-info fs-4"></i>
                                                </div>
                                                <div>
                                                    <div class="fw-bold fs-5 {{ $m->id === Auth::id() ? 'text-info' : 'text-white' }}">{{ $m->username }}</div>
                                                    <small class="text-muted">Operacional</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-center">
                                            @if($m->id === $alianca->fundador_id)
                                                <span class="badge bg-warning text-dark px-3 rounded-pill text-uppercase small fw-bold">Comandante Supremo</span>
                                            @else
                                                <span class="badge bg-secondary px-3 rounded-pill text-uppercase small font-normal">Oficial Coligado</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-4 text-end text-muted small">
                                            {{ \Carbon\Carbon::parse($m->updated_at)->format('d/m/Y') }}
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
</div>

<style>
.ls-1 { letter-spacing: 1px; }
.x-small { font-size: 0.7rem; }
.avatar-sm { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; }
.glassmorphism {
    background: rgba(30,30,30, 0.7) !important;
    backdrop-filter: blur(10px);
}
</style>
@endsection
