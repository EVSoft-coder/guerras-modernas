@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <h1>Bem-vindo, {{ Auth::user()->username }}!</h1>
    <p>Esta é a tua Base Principal.</p>
    
    @if (isset($base))
        <div class="card">
            <div class="card-body">
                <h4>{{ $base->nome }}</h4>
                <p>Coordenadas: ({{ $base->coordenada_x }} | {{ $base->coordenada_y }})</p>
                <p>QG Nível: {{ $base->qg_nivel }} | Muralha: {{ $base->muralha_nivel }}</p>
            </div>
        </div>
    @endif

    <a href="{{ route('logout') }}" class="btn btn-danger mt-3">Sair</a>
</div>
@endsection