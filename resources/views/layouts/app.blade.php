<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guerras Modernas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="{{ asset('css/index.css') }}?v={{ time() }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">Guerras Modernas</a>
            
            @if (Auth::check())
                <div class="navbar-nav ms-auto">
                    <span class="nav-link">Olá, {{ Auth::user()->username }}</span>
                    <a class="nav-link {{ Route::is('dashboard') ? 'active fw-bold' : '' }}" href="{{ route('dashboard') }}">Dashboard</a>
                    <a class="nav-link {{ Route::is('mapa') ? 'active fw-bold' : '' }}" href="{{ route('mapa') }}">Mapa Tático</a>
                    <a class="nav-link {{ Route::is('ranking') ? 'active fw-bold' : '' }}" href="{{ route('ranking') }}">Classificação</a>
                    <a class="nav-link {{ Route::is('alianca.*') ? 'active fw-bold' : '' }}" href="{{ route('alianca.index') }}">Coligação</a>
                    <form method="POST" action="{{ route('logout') }}" class="d-inline">
                        @csrf
                        <button type="submit" class="nav-link btn btn-link text-danger">Sair</button>
                    </form>
                </div>
            @else
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="{{ route('login.form') }}">Login</a>
                    <a class="nav-link btn btn-outline-light ms-2" href="{{ route('register.form') }}">Registar</a>
                </div>
            @endif
        </div>
    </nav>

    <div class="container mt-4">
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>