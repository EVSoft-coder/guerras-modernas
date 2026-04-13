@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="row">
        <!-- INFO GERAL DA ALIANÇA -->
        <div class="col-md-4">
            <div class="card bg-dark border-info/30 rounded-4 shadow-lg glassmorphism mb-4">
                <div class="card-body text-center p-5">
                    <div class="mb-4">
                        <span class="badge bg-info text-dark display-6 p-3 rounded-4 shadow-sm fw-bold">[{{ $alianca->tag }}]</span>
                    </div>
                    <h2 class="text-white fw-bold mb-1">{{ $alianca->nome }}</h2>
                    <p class="text-muted small text-uppercase ls-1">Comando Coligado de Operações</p>
                    
                    <div class="mt-4 p-3 rounded bg-white/5 border border-white/10 text-start">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small">Fundador:</span>
                            <span class="text-white fw-bold">{{ $alianca->fundador->username }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small">Membros:</span>
                            <span class="text-info fw-bold">{{ $alianca->membros->count() }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small">Ponto no Ranking:</span>
                            <span class="text-white">Em breve</span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <form action="{{ route('alianca.sair') }}" method="POST" onsubmit="return confirm('Tem a certeza que deseja sair desta aliança militar?')">
                            @csrf
                            <button type="submit" class="btn btn-outline-danger btn-sm rounded-pill px-4">Sair da Aliança</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- LISTA DE ALIADOS E PEDIDOS -->
        <div class="col-md-8">
            <!-- PEDIDOS DE RECRUTAMENTO (Apenas se for fundador) -->
            @if($alianca->fundador_id === Auth::id() && $alianca->pedidos->where('status', 'pendente')->count() > 0)
                <div class="card bg-dark border-warning/30 rounded-4 shadow-lg glassmorphism mb-4">
                    <div class="card-header bg-warning/10 border-bottom border-warning/20 py-3">
                        <h5 class="mb-0 text-warning fw-bold"><i class="bi bi-person-plus-fill me-2"></i> Candidaturas ao Recrutamento (Pendentes)</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-dark mb-0 align-middle">
                                <thead class="small text-muted text-uppercase fw-bold border-bottom border-white/5">
                                    <tr>
                                        <th class="px-4 py-3">Candidato</th>
                                        <th class="px-4 py-3 text-end">Ação Diplomática</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($alianca->pedidos->where('status', 'pendente') as $p)
                                        <tr>
                                            <td class="px-4 py-3 fw-bold text-white fs-5">{{ $p->jogador->username }}</td>
                                            <td class="px-4 py-3 text-end">
                                                <form action="{{ route('alianca.decidir', [$p->id, 'aprovar']) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-success rounded-pill px-4 fw-bold text-uppercase x-small">Aprovar</button>
                                                </form>
                                                <form action="{{ route('alianca.decidir', [$p->id, 'rejeitar']) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold text-uppercase x-small ms-2">Recusar</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            @endif

            <div class="card bg-dark border-secondary rounded-4 shadow-lg glassmorphism h-100">
                <div class="card-header bg-black/20 border-bottom border-white/5 py-3">
                    <h5 class="mb-0 text-white fw-bold"><i class="bi bi-people-fill text-info me-2"></i> Pessoal da Aliança (Aliados)</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-dark table-hover mb-0 align-middle">
                            <thead class="bg-black/40 text-muted x-small text-uppercase fw-bold border-bottom border-white/5">
                                <tr>
                                    <th class="px-4 py-3">Câmbio de Comando</th>
                                    <th class="px-4 py-3">Função</th>
                                    <th class="px-4 py-3 text-end">Ingressou em</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($alianca->membros as $m)
                                    <tr>
                                        <td class="px-4 py-4">
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-sm me-3 bg-white/5 rounded p-2 text-center">
                                                    <i class="bi bi-person-badge text-info fs-4"></i>
                                                </div>
                                                <div>
                                                    <div class="fw-bold fs-5 {{ $m->id === Auth::id() ? 'text-info' : 'text-white' }}">{{ $m->username }}</div>
                                                    <small class="text-muted">Operacional</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-center">
                                            @if($m->id === $alianca->fundador_id)
                                                <span class="badge bg-warning text-dark px-3 rounded-pill text-uppercase small fw-bold">Comandante Supremo</span>
                                            @else
                                                <span class="badge bg-secondary px-3 rounded-pill text-uppercase small font-normal">Oficial Coligado</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-4 text-end text-muted small">
                                            {{ \Carbon\Carbon::parse($m->updated_at)->format('d/m/Y') }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    <div class="row mt-4">
        <!-- CANAL DE COMUNICAÇÕES DA ALIANÇA -->
        <div class="col-12">
            <div class="card glassmorphism border-info/20 shadow-2xl rounded-5 overflow-hidden">
                <div class="card-header bg-info/10 border-bottom border-white/5 py-4 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 text-white fw-black text-uppercase ls-1">📡 Frequência de Comando da Coligação</h5>
                    <span class="badge bg-info/20 text-info border border-info/40 px-3 py-2 animate-glow">CONEXÃO SEGURA 🔒</span>
                </div>
                <div class="card-body p-0">
                    <!-- ÁREA DE MENSAGENS -->
                    <div id="chatFeed" class="p-4" style="height: 450px; overflow-y: auto; background: rgba(0,0,0,0.2);">
                        @forelse($mensagens as $msg)
                            <div class="mb-4 d-flex {{ $msg->jogador_id === Auth::id() ? 'justify-content-end' : 'justify-content-start' }}">
                                <div class="p-3 rounded-4 shadow-sm border {{ $msg->jogador_id === Auth::id() ? 'bg-info/10 border-info/30 text-end' : 'bg-white/5 border-white/10' }}" style="max-width: 70%;">
                                    <div class="d-flex justify-content-between align-items-center mb-1 gap-3">
                                        <small class="fw-black text-info text-uppercase ls-1" style="font-size: 0.65rem;">{{ $msg->jogador->username }}</small>
                                        <small class="text-muted" style="font-size: 0.6rem;">{{ $msg->created_at->format('H:i') }}</small>
                                    </div>
                                    <div class="text-white fs-6">{{ $msg->mensagem }}</div>
                                </div>
                            </div>
                        @empty
                            <div class="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                                <i class="bi bi-chat-dots display-3 opacity-10 mb-3"></i>
                                <p class="small text-uppercase ls-1">Silêncio de Rádio. Sem comunicações registadas.</p>
                            </div>
                        @endforelse
                    </div>

                    <!-- FORMULÁRIO DE ENVIO TÁTICO -->
                    <div class="p-4 bg-black/30 border-top border-white/5">
                        <form id="chatForm" class="d-flex gap-3">
                            @csrf
                            <input type="text" id="chatInput" placeholder="Digite ordens ou relatórios de inteligência..." 
                                   class="form-control form-control-lg bg-white/5 border-white/10 text-white placeholder-white/30 rounded-4 px-4 py-3" required>
                            <button type="submit" class="btn btn-info rounded-4 px-5 fw-black text-uppercase ls-1">ENVIAR</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.ls-1 { letter-spacing: 1px; }
.x-small { font-size: 0.7rem; }
.avatar-sm { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; }
.glassmorphism {
    background: rgba(30,30,30, 0.7) !important;
    backdrop-filter: blur(10px);
}
#chatFeed::-webkit-scrollbar { width: 6px; }
#chatFeed::-webkit-scrollbar-track { background: transparent; }
#chatFeed::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 3px; }
#chatFeed::-webkit-scrollbar-thumb:hover { background: rgba(14, 165, 233, 0.5); }
.animate-glow { animation: pulse-glow 3s infinite alternate; }
@keyframes pulse-glow { from { box-shadow: 0 0 10px rgba(13, 202, 240, 0.1); } to { box-shadow: 0 0 20px rgba(13, 202, 240, 0.3); } }
</style>

<script>
    let lastMessageId = {{ $mensagens->last() ? $mensagens->last()->id : 0 }};

    function pollMessages() {
        fetch(`{{ route('alianca.chat.buscar') }}?last_id=${lastMessageId}`)
            .then(r => r.json())
            .then(messages => {
                if (messages.length > 0) {
                    const feed = document.getElementById('chatFeed');
                    messages.forEach(msg => {
                        const isMe = msg.jogador_id == {{ Auth::id() }};
                        const row = document.createElement('div');
                        row.className = `mb-4 d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`;
                        row.innerHTML = `
                            <div class="p-3 rounded-4 shadow-sm border ${isMe ? 'bg-info/10 border-info/30 text-end' : 'bg-white/5 border-white/10'}" style="max-width: 70%;">
                                <div class="d-flex justify-content-between align-items-center mb-1 gap-3">
                                    <small class="fw-black text-info text-uppercase ls-1" style="font-size: 0.65rem;">${msg.jogador}</small>
                                    <small class="text-muted" style="font-size: 0.6rem;">${msg.data}</small>
                                </div>
                                <div class="text-white fs-6">${msg.mensagem}</div>
                            </div>
                        `;
                        feed.appendChild(row);
                        lastMessageId = msg.id;
                        
                        // Play sound if not me?
                        if (!isMe) {
                            playChatSound();
                        }
                    });
                    feed.scrollTop = feed.scrollHeight;
                }
            });
    }

    function playChatSound() {
        const audio = new Audio('https://www.soundjay.com/communication/beep-07.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio block by browser'));
    }

    setInterval(pollMessages, 3000);

    document.addEventListener('DOMContentLoaded', () => {
        const feed = document.getElementById('chatFeed');
        feed.scrollTop = feed.scrollHeight; // Scroll at� ao fundo
    });

    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if(!msg) return;

        const btn = this.querySelector('button');
        btn.disabled = true;

        fetch('{{ route("alianca.chat.enviar") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ mensagem: msg })
        })
        .then(r => r.json())
        .then(data => {
            if(data.success) {
                // Polling will catch it, or we append immediately
                input.value = '';
                pollMessages(); 
            }
        })
        .finally(() => {
            btn.disabled = false;
        });
    });
</script>
@endsection

