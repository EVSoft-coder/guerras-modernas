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
- [x] **Sistema de Conquista (Nobres):** Implementar unidade especial (ex: "Oficial de Inteligência" ou "Comandante Operacional") que diminui a "Lealdade" (Loyalty) das bases inimigas. Quando a lealdade chega a 0, a base muda de dono.
- [x] **Estatísticas de Pontos:** Implementar o cálculo real de pontos baseado na tabela `edificios`. Criar um Cron Job ou Observer que atualiza a coluna `pontos` na tabela `bases` sempre que um edifício é concluído.
- [x] **Gestão Massiva:** Telas estilo "Overviews" para recrutar, construir e ver movimentos em dezenas de aldeias de uma vez.

### 💰 FASE 2: Monetização e Contas Premium (EM PROGRESSO)
- [x] **Pontos Premium:** Implementada a moeda premium e o sistema de saldo (`pontos_premium`).
- [x] **Funcionalidades Premium:** 
  - [x] Redução de tempo de construção/recrutamento pela metade (30 pontos premium).
  - [x] Conta Premium ativa:
    - [x] +20% Produção de Recursos.
    - [x] Fila de Construção Alargada (Total 10 slots).
    - [x] Acesso exclusivo ao Alto Comando (Mass Overviews).
- [x] **Mercado Premium:** Sistema de troca de PP por recursos entre jogadores (Peer-to-Peer).
- [x] **Correções Críticas:** Fix no regresso automático de tropas (null pointer origin_id).
- [ ] Gestor de Conta / Assistente de Farming (Automatização de ataques a bárbaras/rebeldes).
- [ ] Visualizadores táticos avançados (Gráficos de evolução).

### ⚔️ FASE 3: Combate Avançado e Alianças (Tribos)
- [ ] **Planeador de Ataques / Snipe:** Ferramenta da aliança para planear operações conjuntas. Identificação visual de ataques no mapa e ecrãs partilhados.
- [ ] **Acampamento / Suportes:** Permitir que unidades de defesa permaneçam na base aliada para ajudar a defendê-la (já existe a tabela `reinforcements`, necessita ser ativada no motor de combate e UI).
- [ ] **Simulador de Combate:** Uma ferramenta na UI (Praça de Reunião/Comando Central) para testar desfechos de batalhas incluindo sorte, moral e nível de muralha.

### 🏆 FASE 4: Endgame (Fim de Mundo)
- [ ] **Segredos / Artefactos:** Bases especiais ou itens que a aliança precisa de segurar durante X tempo para ganhar o mundo.
- [ ] **Domínio Territorial:** Modo onde controlar 70% dos setores do mapa (chunks) dita o vencedor.

---

## 🛡️ ESTADO DA AUDITORIA (28 de Abril)

| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **Código Fonte (Frontend)** | ⚠️ Tech Debt | Correção de erro no `vite.config.js` aplicada. Existem ~500 avisos de linting no TypeScript (`any` types), que deverão ser mitigados progressivamente. |
| **Base de Dados** | ⚠️ Ajustes | Criado `db_adjustments.sql` para otimização de queries, introdução da coluna `pontos` e `pontos_premium`. |
| **Recrutamento / Fila** | ✅ OK | Funcional, mas a fila de edifícios está limitada. Conta premium pode expandir isto. |
| **Combate** | ✅ OK | PvP e PvE (Rebeldes) operacionais. Falta a mecânica de baixar lealdade para conquista. |
| **Mapa Mundo** | ✅ OK | Design modernizado. Precisará de otimização de carregamento se o mapa passar de 1000x1000. |

---

### 📋 AÇÕES IMEDIATAS:
1. Executar o ficheiro `db_adjustments.sql` no PHPMyAdmin.
2. Iniciar a Fase 1 (Sistema de Conquista e Pontos da Base).
