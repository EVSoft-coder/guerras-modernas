@extends('layouts.app')

@section('content')
<div class="min-vh-100 d-flex align-items-center" style="background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1585208798174-6cedd78e0198?ixlib=rb-4.0.3&auto=format&fit=crop&q=80') no-repeat center center; background-size: cover;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 text-center text-white">
                <h1 class="display-3 fw-bold mb-3">Guerras Modernas</h1>
                <p class="lead mb-5">O teu jogo de estratégia militar moderna inspirado no Tribal Wars.<br>
                Infantaria • Fuzileiros • Comandos • Paraquedistas • Conquistas em tempo real</p>
                
                <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                    <a href="{{ route('register.form') }}" class="btn btn-primary btn-lg px-5 py-3">Criar Conta</a>
                    <a href="{{ route('login.form') }}" class="btn btn-outline-light btn-lg px-5 py-3">Entrar</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
