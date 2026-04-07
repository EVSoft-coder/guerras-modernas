@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="text-center mb-5">
                <i class="bi bi-shield-shaded text-info display-1 opacity-50 mb-3"></i>
                <h1 class="text-white fw-bold">Fundar Coligação</h1>
                <p class="text-muted text-uppercase small ls-2">Cria o teu bloco de poder mundial</p>
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
                        <div class="form-text text-muted small mt-2">A Tag aparecerá ao lado do teu nome no ranking mundial.</div>
                    </div>

                    <button type="submit" class="btn btn-info w-100 p-3 rounded-pill fw-bold text-uppercase ls-1 shadow-glow">
                        <i class="bi bi-flag-fill me-2"></i> Fundar Aliança
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
.ls-2 { letter-spacing: 2px; }
.glassmorphism {
    background: rgba(30,30,30, 0.8) !important;
    backdrop-filter: blur(10px);
}
.shadow-glow:hover { box-shadow: 0 0 15px rgba(13, 202, 240, 0.4); }
</style>
@endsection
