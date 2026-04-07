<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guerras Modernas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">Guerras Modernas</a>
            @if (Auth::check())
                <div class="navbar-nav ms-auto">
                    <span class="nav-link">Olá, {{ Auth::user()->username }}</span>
                    <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
                    <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                        @csrf
                        <button type="submit" class="nav-link btn btn-link">Sair</button>
                    </form>
                </div>
            @else
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="{{ route('login.form') }}">Login</a>
                    <a class="nav-link" href="{{ route('register.form') }}">Registar</a>
                </div>
            @endif
        </div>
    </nav>

    @yield('content')
</body>
</html>