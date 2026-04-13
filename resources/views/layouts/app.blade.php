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
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="bg-black text-white antialiased">
    {{-- Fallback para silenciar erro de 'dataset' do Inertia em páginas Blade --}}
    <div id="app" data-page="{&quot;url&quot;:&quot;/&quot;}" style="display: none;"></div>
    
    <nav class="navbar navbar-expand-lg navbar-dark px-3 mt-4">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">Guerras Modernas</a>
            
            @if (Auth::check())
                <div class="navbar-nav ms-auto align-items-center">
                    <span class="nav-item me-3 text-info font-monospace x-small fw-bold border border-info/30 px-2 py-1 rounded bg-info/10" id="server-clock">
                        {{ now()->format('H:i:s') }}
                    </span>
                    <span class="nav-link">Olá, {{ Auth::user()->username }}</span>
                    <a class="nav-link {{ Route::is('dashboard') ? 'active fw-bold' : '' }}" href="{{ route('dashboard') }}">Dashboard</a>
                    <a class="nav-link {{ Route::is('mapa') ? 'active fw-bold' : '' }}" href="{{ route('mapa') }}">Mapa Tático</a>
                    <a class="nav-link {{ Route::is('ranking') ? 'active fw-bold' : '' }}" href="{{ route('ranking') }}">Classificação</a>
                    <a class="nav-link {{ Route::is('alianca.*') ? 'active fw-bold' : '' }}" href="{{ route('alianca.index') }}">Coligação</a>
                    <a class="nav-link {{ Route::is('manual') ? 'active fw-bold' : '' }}" href="{{ route('manual') }}">Infopédia</a>
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
    <script>
        // Relógio do Servidor Global
        let serverTime = new Date("{{ now()->toIso8601String() }}");
        const clockEl = document.getElementById('server-clock');
        if (clockEl) {
            setInterval(() => {
                serverTime.setSeconds(serverTime.getSeconds() + 1);
                clockEl.innerText = serverTime.toLocaleTimeString('pt-PT', { hour12: false });
            }, 1000);
        }
    </script>
</body>
</html>
