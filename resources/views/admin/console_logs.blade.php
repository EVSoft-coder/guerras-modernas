@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-white fw-black m-0"><i class="bi bi-terminal-fill text-success"></i> CONSOLA DE INTELIGÊNCIA (LOGS)</h4>
            <div>
                <button onclick="fetchLogs()" class="btn btn-sm btn-outline-info rounded-pill px-3">
                    <i class="bi bi-arrow-clockwise"></i> ATUALIZAR
                </button>
                <a href="{{ route('admin.logs.clear') }}" class="btn btn-sm btn-outline-danger rounded-pill px-3 ms-2" onclick="return confirm('Limpar todo o histórico de logs?')">
                    <i class="bi bi-trash-fill"></i> LIMPAR LOG
                </a>
            </div>
        </div>

        <div class="card glassmorphism border-success/30 shadow-2xl">
            <div class="card-body p-0">
                <div id="log-terminal" class="p-3 font-monospace bg-black/80 text-success rounded-4" style="height: 600px; overflow-y: auto; font-size: 0.85rem; line-height: 1.4; border: 1px solid rgba(0, 255, 0, 0.1);">
                    <div class="opacity-50">[SISTEMA INICIADO - AGUARDANDO DADOS...]</div>
                </div>
            </div>
            <div class="card-footer bg-black/40 border-success/10 py-2">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="x-small text-success fw-bold opacity-70">SERVIDOR: mw.evsoft.csmanager.ovh</span>
                    <span class="x-small text-white opacity-50" id="last-update">ÚLTIMA ATUALIZAÇÃO: --:--:--</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #log-terminal::-webkit-scrollbar { width: 8px; }
    #log-terminal::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    #log-terminal::-webkit-scrollbar-thumb { background: rgba(0,255,0,0.2); border-radius: 4px; }
    #log-terminal::-webkit-scrollbar-thumb:hover { background: rgba(0,255,0,0.4); }
    
    .log-entry { margin-bottom: 4px; border-bottom: 1px solid rgba(0,255,0,0.05); padding-bottom: 4px; }
    .log-error { color: #ff5555; font-weight: bold; }
    .log-warning { color: #ffaa00; }
    .log-info { color: #55ff55; }
</style>

<script>
    function fetchLogs() {
        const terminal = document.getElementById('log-terminal');
        const clock = document.getElementById('last-update');

        fetch("{{ route('admin.logs.fetch') }}")
            .then(response => response.json())
            .then(data => {
                const lines = data.content.split('\n');
                let formatted = '';
                
                lines.forEach(line => {
                    if (line.trim() === '') return;
                    
                    let cls = 'log-info';
                    if (line.includes('.ERROR') || line.includes('Exception')) cls = 'log-error';
                    if (line.includes('.WARNING')) cls = 'log-warning';
                    
                    formatted += `<div class="log-entry ${cls}">${line}</div>`;
                });
                
                terminal.innerHTML = formatted;
                terminal.scrollTop = terminal.scrollHeight;
                clock.innerText = `ÚLTIMA ATUALIZAÇÃO: ${data.last_update}`;
            })
            .catch(error => {
                terminal.innerHTML += `<div class="log-error">[ERRO DE CONEXÃO: Falha ao carregar logs]</div>`;
            });
    }

    // Auto-update a cada 5 segundos
    setInterval(fetchLogs, 5000);
    window.onload = fetchLogs;
</script>
@endsection
