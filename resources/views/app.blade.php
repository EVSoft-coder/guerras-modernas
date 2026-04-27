<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Guerras Modernas</title>
        <meta name="csrf-token" content="{{ csrf_token() }}"> <!-- CSRF Shield Active -->
        
        <!-- Fonts & Style Fallbacks -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
        
        @viteReactRefresh
        @routes
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        <script>
            console.log("BLADE OK V1");
        </script>

    </head>
    <body class="bg-black text-white antialiased">
        @inertia
    </body>
</html>
