<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guerras Modernas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body { background-color: #0f172a; color: #e2e8f0; }
        .navbar { background-color: #1e2937; }
    </style>
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