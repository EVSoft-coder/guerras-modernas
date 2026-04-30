# 🗺️ ROADMAP 2.0 - Guerras Modernas (Expansão Tática)

> **Estado Atual:** Estabilização total e Modernização Visual concluídas. Mapa Mundo elevado ao padrão "Tribal Wars".

---

## ✅ TRABALHO RECENTE (CONCLUÍDO)
- **Modernização do Mapa Mundo:**
    - 4 Níveis visuais de bases baseados em pontos (Posto -> Centro de Comando).
    - Esquema de cores tático (Azul/Amarelo/Vermelho/Cinza).
    - Grelha tática com coordenadas e Scanlines CRT.
    - Hover Tooltip em tempo real no Canvas.
- **Estabilização de Combate:**
    - Fix crítico em ataques contra NPCs (Rebeldes).
    - Cálculo dinâmico de pontos integrado no controlador do mapa.
    - Normalização de datas e limpeza de movimentos orfãos.

## 🚀 RUMO AO TRIBAL WARS (O Caminho a Seguir)

Para transformar "Guerras Modernas" numa experiência completa estilo Tribal Wars, as seguintes fases são necessárias:

### 🛡️ FASE 1: Gestão de Múltiplas Bases (O Core)
- [x] **Recrutamento Centralizado no HQ:** Políticos e Moedas agora operam no Centro de Comando (HQ Nível 20).
- [ ] **Escalonamento de Custos (Coins):** Implementar lógica de custo progressivo para moedas de ouro.
- [ ] **Mercado (Trading Hub):** Finalizar interface e lógica de troca de recursos.
- [ ] **Sistema de Conquista (Nobres):** Unidade especial e lógica de lealdade integradas.
- [ ] **Visão Global Império:** Painel para gerir múltiplas bases simultaneamente.
- [ ] **Dashboard de Guerra:** Estatísticas em tempo real de conquistas da aliança.
- [x] **Gestão Massiva:** Telas estilo "Overviews" para recrutar e gerir apoios em massa.

### 💰 FASE 2: Monetização e Contas Premium (EM PROGRESSO)
- [x] **Pontos Premium:** Implementada a moeda premium e o sistema de saldo.
- [x] **Funcionalidades Premium:** 
  - [x] Redução de tempo (30 PP).
  - [x] Conta Premium ativa (+20% recursos, 10 slots).
  - [x] Alto Comando (Mass Overviews).
- [x] **Mercado Premium:** Peer-to-Peer.
- [x] **Assistente de Farming:** Automatização de ataques a bárbaras/rebeldes.
- [ ] Visualizadores táticos avançados (Gráficos de evolução).

### ⚔️ FASE 3: Combate Avançado e Alianças (Tribos)
- [ ] **Planeador de Ataques / Snipe:** Planeamento de operações conjuntas.
- [x] **Acampamento / Suportes:** Ativada a tabela `reinforcements` e interface de gestão no Alto Comando.
- [x] **Simulador de Combate:** Ferramenta tática de simulação com sorte, moral e muralha.

### 🏆 FASE 4: Endgame (Fim de Mundo)
- [ ] **Segredos / Artefactos:** Bases especiais ou itens que a aliança precisa de segurar durante X tempo para ganhar o mundo.
- [ ] **Domínio Territorial:** Modo onde controlar 70% dos setores do mapa (chunks) dita o vencedor.

---

### 🛡️ ESTADO DA AUDITORIA (29 de Abril)

| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **Código Fonte (Frontend)** | ✅ Melhorado | Introduzidos Tipos Fortes (`resources/js/types/game.ts`). Migração de `any` iniciada no CommandCenter e Dashboard. |
| **Integridade de Pontos** | ✅ Estável | Mapeamento de edifícios corrigido e recálculo em tempo real (Conquista/Build). |
| **Processamento de Movimentos**| ✅ Estável | Otimizado via Global Ticker para evitar lag em ataques massivos. |
| **Segurança de Transações** | ✅ Estável | Locks pessimistas aplicados em recrutamento e combate. |

---

### 📋 AÇÕES IMEDIATAS:
1. Executar o ficheiro `db_adjustments.sql` no PHPMyAdmin.
2. Iniciar a Fase 1 (Sistema de Conquista e Pontos da Base).
