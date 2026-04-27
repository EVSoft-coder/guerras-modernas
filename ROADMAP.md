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

---

## 🛠️ FASE 1: Inteligência e Comunicação (IMEDIATO)
- [ ] **Global War Feed:** Feed em tempo real no dashboard mostrando movimentos globais (Setores em conflito).
- [ ] **Push Notifications:** Alertas de browser para ataques a chegar (Mesmo com a aba fechada).
- [ ] **Arquivo de Inteligência:** Interface para gerir e partilhar relatórios de espionagem com a aliança.

## ⚔️ FASE 2: Diplomacia e Operações de Aliança
- [ ] **Planeador de Ataques:** Ferramenta para coordenar ataques de múltiplos jogadores para chegar ao mesmo segundo.
- [ ] **Fórum de Guerra:** Tópicos internos de aliança com integração de coordenadas clicáveis.
- [ ] **Reforços Dinâmicos:** Interface para ver unidades aliadas estacionadas na nossa base.

## 🛰️ FASE 3: Profundidade de Jogabilidade
- [ ] **Árvore de Talentos de Generais:** Especializações ofensivas/defensivas (ex: General de Artilharia).
- [ ] **Logística de Recursos:** Sistema de transporte de recursos entre bases (Comboios de Suprimentos).
- [ ] **Mercado Negro:** Troca de recursos por créditos ou outros materiais.

---

## 🛡️ ESTADO DA AUDITORIA

| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **Recrutamento** | ✅ OK | Estável com normalização Carbon. |
| **Combate / Espionagem** | ✅ OK | Fix NPC aplicado. Relatórios consistentes. |
| **Mapa Mundo** | ✅ OK | Visual Moderno + Hover Tático ativado. |
| **Sincronização** | ✅ OK | SyncSystem.ts otimizado para evitar erros 422. |

---

### 🚀 PRÓXIMOS PASSOS:
1. **Deploy Final** (Push das imagens de bases e WorldMapEngine).
2. **Implementação do Global War Feed** (Início da Fase 1).
3. **Monitorização de Performance** do Canvas com o novo sistema de Hover.
