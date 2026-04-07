@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="row">
        <!-- FUNDAR ALIANÇA -->
        <div class="col-md-5">
            <div class="text-center mb-4">
                <i class="bi bi-shield-shaded text-info display-4 opacity-50 mb-2"></i>
                <h2 class="text-white fw-bold">Fundar Coligação</h2>
                <p class="text-muted small text-uppercase ls-1">Cria o teu bloco de poder mundial</p>
            </div>

            <div class="card bg-dark border-secondary rounded-4 shadow-lg glassmorphism p-4">
                <form action="{{ route('alianca.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="form-label text-muted small text-uppercase fw-bold">Nome da Aliança</label>
                        <input type="text" name="nome" class="form-control bg-black/40 border-white/10 text-white p-3 rounded-3" 
                               placeholder="Ex: Força de Pacificação Mundial" required maxlength="100">
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-muted small text-uppercase fw-bold">Tag (Sigla Militar)</label>
                        <input type="text" name="tag" class="form-control bg-black/40 border-white/10 text-white p-3 rounded-3" 
                               placeholder="Ex: NATO" required maxlength="10">
                    </div>

                    <button type="submit" class="btn btn-info w-100 p-3 rounded-pill fw-bold text-uppercase ls-1 shadow-glow">
                        <i class="bi bi-flag-fill me-2"></i> Fundar Aliança
                    </button>
                </form>
            </div>
        </div>

        <!-- LISTA DE ALIANÇAS EXISTENTES -->
        <div class="col-md-7">
            <div class="text-center mb-4">
                <i class="bi bi-search text-muted display-4 opacity-50 mb-2"></i>
                <h2 class="text-white fw-bold">Pactos Diplomáticos</h2>
                <p class="text-muted small text-uppercase ls-1">Junta-te a uma força existente</p>
            </div>

            <div class="card bg-dark border-white/5 rounded-4 shadow-lg overflow-hidden glassmorphism">
                <div class="table-responsive">
                    <table class="table table-dark table-hover mb-0 align-middle text-center">
                        <thead class="bg-black/40 text-muted x-small text-uppercase fw-bold border-bottom border-white/5">
                            <tr>
                                <th class="px-3 py-3">Tag</th>
                                <th class="px-3 py-3 text-start">Nome da Aliança</th>
                                <th class="px-3 py-3">Efetivo</th>
                                <th class="px-3 py-3">Diplomacia</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($aliancas as $a)
                                <tr>
                                    <td class="px-3 py-4"><span class="badge bg-info/20 text-info fw-bold">[{{ $a->tag }}]</span></td>
                                    <td class="px-3 py-4 text-start fw-bold text-white">{{ $a->nome }}</td>
                                    <td class="px-3 py-4 text-muted small">{{ $a->membros_count }} ativos</td>
                                    <td class="px-3 py-4">
                                        @if($pedidoPendente && $pedidoPendente->alianca_id === $a->id)
                                            <span class="badge bg-warning text-dark px-3 rounded-pill p-2 fw-bold text-uppercase x-small">Aguardando Resposta</span>
                                        @elseif($pedidoPendente)
                                            <button class="btn btn-sm btn-dark rounded-pill px-3 opacity-50" disabled>Indisponível</button>
                                        @else
                                            <form action="{{ route('alianca.pedir') }}" method="POST">
                                                @csrf
                                                <input type="hidden" name="alianca_id" value="{{ $a->id }}">
                                                <button type="submit" class="btn btn-sm btn-outline-info rounded-pill px-4 fw-bold text-uppercase x-small">
                                                    Pedir Adesão
                                                </button>
                                            </form>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="p-5 text-center text-muted italic small">Nenhum pacto diplomático ativo no servidor.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            
            @if($pedidoPendente)
                <div class="alert alert-info border-0 mt-3 p-3 rounded-3 small">
                    <i class="bi bi-info-circle-fill me-2"></i> Tens um pedido de adesão para <strong>{{ $pedidoPendente->alianca->nome }}</strong> a aguardar aprovação.
                </div>
            @endif
        </div>
    </div>
</div>

<style>
.ls-1 { letter-spacing: 1px; }
.x-small { font-size: 0.7rem; }
.glassmorphism {
    background: rgba(30,30,30, 0.7) !important;
    backdrop-filter: blur(10px);
}
.shadow-glow:hover { box-shadow: 0 0 15px rgba(13, 202, 240, 0.3); }
</style>
@endsection
