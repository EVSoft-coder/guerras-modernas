@extends('layouts.app')

@section('content')
<div class="row g-4">
    <!-- HERO HEADER -->
    <div class="col-12">
        <div class="glassmorphism rounded-5 overflow-hidden border border-white/20 shadow-2xl position-relative mb-2" style="height: 350px;">
            <img src="{{ asset('modern_warfare_manual_hero_1775689703097.png') }}" class="w-100 h-100 object-fit-cover opacity-60" style="filter: hue-rotate(180deg) brightness(0.8);">
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div class="position-absolute bottom-0 start-0 p-5 w-100">
                <span class="badge bg-info text-dark text-uppercase fw-black ls-1 mb-2 px-3 py-2">Diretiva de InteligÍncia #001</span>
                <h1 class="text-white fw-black display-4 mb-0" style="letter-spacing: -2px;">MANUAL DO COMANDANTE</h1>
                <p class="text-info/80 fw-bold fs-5 mb-0">Especifica√ß√µes T√©cnicas e Protocolos de Combate</p>
            </div>
            <div class="scanner-line"></div>
        </div>
    </div>

    <!-- NAVEGA√á√ÉO INTERNA -->
    <div class="col-12 px-4">
        <ul class="nav nav-pills gap-3 bg-black/40 p-2 rounded-pill border border-white/5 d-inline-flex" id="manualTabs">
            <li class="nav-item">
                <a class="nav-link active rounded-pill px-4 fw-black text-uppercase ls-1" data-bs-toggle="pill" href="#units">Unidades Militares</a>
            </li>
            <li class="nav-item">
                <a class="nav-link rounded-pill px-4 fw-black text-uppercase ls-1" data-bs-toggle="pill" href="#buildings">Infraestruturas</a>
            </li>
            <li class="nav-item">
                <a class="nav-link rounded-pill px-4 fw-black text-uppercase ls-1" data-bs-toggle="pill" href="#rules">Regras de Engajamento</a>
            </li>
        </ul>
    </div>

    <div class="col-12">
        <div class="tab-content" id="manualTabContent">
            <!-- ABA: UNIDADES -->
            <div class="tab-pane fade show active" id="units">
                <div class="row g-4">
                    @foreach($units as $key => $u)
                        <div class="col-md-6 col-xl-4">
                            <div class="card glassmorphism border-info/20 h-100 hover-glow transition-all">
                                <div class="card-header bg-info/5 border-bottom border-white/5 py-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0 text-info fw-black text-uppercase">{{ $u['name'] }}</h5>
                                        <div class="rounded-pill bg-info/20 px-3 py-1 text-info x-small fw-bold border border-info/30">
                                            @if($key == 'agente_espiao') INTEL @else COMBATE @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3 text-center mb-4">
                                        <div class="col-6 bg-black/20 p-2 rounded-3 border border-white/5">
                                            <div class="text-danger small fw-bold">ATAQUE</div>
                                            <div class="fs-4 fw-black text-white">{{ $u['attack'] }}</div>
                                        </div>
                                        <div class="col-6 bg-black/20 p-2 rounded-3 border border-white/5">
                                            <div class="text-success small fw-bold">DEFESA</div>
                                            <div class="fs-4 fw-black text-white">{{ $u['defense_general'] }}</div>
                                        </div>
                                    </div>
                                    <p class="text-white/70 small line-height-base mb-4">
                                        @if($key == 'infantaria') Unidade b·sica de infantaria, ideal para defesa de perÌmetro e incurs√µes r·pidas.
                                        @elseif($key == 'blindado_apc') VeÌculo blindado de transporte que serve como suporte t·tico e logÌstica.
                                        @elseif($key == 'tanque_combate') For√ßa bruta do ex√©rcito. Dano massivo e alta resistÍncia blindada.
                                        @elseif($key == 'helicoptero_ataque') DomÌnio a√©reo. Extremamente r·pido e mortal contra blindados terrestres.
                                        @elseif($key == 'agente_espiao') InvisÌvel ao radar padr√£o. Usado para infiltrar bases e roubar inteligÍncia.
                                        @else Unidade militar de elite treinada para opera√ß√µes de alta intensidade.
                                        @endif
                                    </p>
                                    <div class="separator-text x-small text-muted mb-3 text-uppercase">LogÌstica de Mobiliza√ß√£o</div>
                                    <div class="d-flex flex-wrap gap-2">
                                        @foreach($u['cost'] as $res => $amt)
                                            <span class="badge bg-white/5 border border-white/10 p-2 text-white/80">
                                                {{ ucfirst($res) }}: <span class="text-info">{{ number_format($amt) }}</span>
                                            </span>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- ABA: EDIFICIOS -->
            <div class="tab-pane fade" id="buildings">
                <div class="row g-4">
                    @foreach($buildings as $key => $b)
                        <div class="col-md-6 col-lg-4">
                            <div class="card glassmorphism border-primary/20 h-100">
                                <div class="card-header bg-primary/5 border-bottom border-white/5 py-3">
                                    <h5 class="mb-0 text-primary fw-black text-uppercase">{{ $b['name'] }}</h5>
                                </div>
                                <div class="card-body">
                                    <p class="text-white/70 small italic mb-4">
                                        @if($key == 'qg') Central de comando da base. Desbloqueia novas tecnologias e aumenta eficiÍncia.
                                        @elseif($key == 'posto_recrutamento') Aumenta a capacidade de popula√ß√£o e velocidade de treino.
                                        @elseif($key == 'radar_estrategico') Fornece inteligÍncia avan√ßada sobre movimentos inimigos prÛximos.
                                        @elseif(strpos($key, 'mina') !== false || strpos($key, 'fabrica') !== false || strpos($key, 'refinaria') !== false) Essencial para a produ√ß√£o sustentada de recursos t·ticos.
                                        @else Infraestrutura crÌtica para o desenvolvimento e proje√ß√£o de poder.
                                        @endif
                                    </p>
                                    <div class="bg-black/40 p-3 rounded-4 border border-white/5">
                                        <div class="text-primary small fw-black mb-2 text-uppercase ls-1">Velocidade de Constru√ß√£o</div>
                                        <div class="d-flex align-items-center">
                                            <div class="flex-grow-1 progress bg-white/5" style="height: 8px;">
                                                <div class="progress-bar bg-primary" style="width: {{ 100 - ($b['time_base'] / 10) }}%"></div>
                                            </div>
                                            <span class="ms-3 text-white fw-bold">{{ $b['time_base'] }}s</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- ABA: REGRAS -->
            <div class="tab-pane fade" id="rules">
                <div class="card glassmorphism border-white/10 p-5">
                    <h3 class="text-white fw-black mb-4">PROTOCOLOS DE ENGAJAMENTO</h3>
                    <div class="row g-5">
                        <div class="col-md-6">
                            <h5 class="text-info fw-bold mb-3"><i class="bi bi-shield-lock me-2"></i> Prote√ß√£o de Iniciante</h5>
                            <p class="text-white/70">Novos comandantes tÍm 24 horas de imunidade total. Ataques lan√ßados contra ou por vocÍ cancelar√£o esta prote√ß√£o imediatamente.</p>
                            
                            <h5 class="text-info fw-bold mb-3 mt-5"><i class="bi bi-crosshair me-2"></i> Mec√¢nica de Saque</h5>
                            <p class="text-white/70">Ataques vitoriosos confiscam at√© 50% dos recursos desprotegidos da base alvo, dependendo da capacidade de carga das tropas sobreviventes.</p>
                        </div>
                        <div class="col-md-6">
                            <h5 class="text-danger fw-bold mb-3"><i class="bi bi-flag-fill me-2"></i> Conquista de Base</h5>
                            <h6 class="text-white small fw-bold">Requisito: HelicÛpteros de Ataque</h6>
                            <p class="text-white/70">Para capturar uma base, vocÍ deve vencer a batalha e ter helicÛpteros na for√ßa de ataque. Cada vitÛria reduz a lealdade da base at√© 0, momento em que ela passa para seu controle.</p>
                            
                            <div class="alert bg-info/10 border-info/30 text-info mt-4 rounded-4">
                                <i class="bi bi-info-circle-fill me-2"></i> <strong>Dica T·tica:</strong> Use Agentes Espi√µes para identificar a guarni√ß√£o inimiga antes de lan√ßar ataques de larga escala.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.nav-pills .nav-link { color: rgba(255,255,255,0.6); }
.nav-pills .nav-link.active { background: var(--primary) !important; color: white; box-shadow: 0 4px 15px var(--primary-shadow); }
.line-height-base { line-height: 1.6; }
.ls-1 { letter-spacing: 1px; }
.hover-glow:hover { box-shadow: 0 0 20px rgba(13, 202, 240, 0.15) !important; transform: translateY(-3px); }
.separator-text { display: flex; align-items: center; }
.separator-text::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.05); margin-left: 10px; }
</style>
@endsection

