# 🛡️ Guerras Modernas: Strategic Roadmap (2026) 🛰️

Este documento traça o comando estratégico e o desenvolvimento técnico do simulador tático **Guerras Modernas**. 🎯💣

---

## ✅ FASE 1: Fundação & Comando (CONCLUÍDO)
- [x] Setup inicial Laravel 12 + MySQL. 🏗️
- [x] Motor de Autenticação Tática (Login/Registo). 🔐
- [x] Interface Industrial Premium (Blade + Vanilla CSS). 🏛️
- [x] Base de Dados Centralizada (mw_guerras.sql). 📊

## ✅ FASE 2: Recursos & Logística (CONCLUÍDO)
- [x] Motor de Geração Automática de Suprimentos, Combustível e Munições. 💰
- [x] Sistema de População (Pessoal) para manutenção militar. 👥
- [x] Atualização de Recursos baseada em tempo (Game Loop). ⏳
- [x] Header dinâmico com indicadores HUD. 📈

## ✅ FASE 3: Infraestrutura & Engenharia (CONCLUÍDO)
- [x] Menu de Edifícios (Mina, Refinaria, Fábrica, Quartel). 🏢
- [x] Sistema de Upgrades (Níveis 1-20). 🏗️
- [x] Fila de Construção (Time-based). 🕒
- [x] Bónus de produção por nível de edifício. ✨

## ✅ FASE 4: Cartografia & Domínio (CONCLUÍDO)
- [x] Mapa Tático Interativo (Coordenadas X|Y). 🗺️
- [x] Localização de bases inimigas e aliadas. 🛰️
- [x] Distâncias calculadas matematicamente para ataques. 📐
- [x] Estética "Deep Space/Desert" no mapa. 🏜️

## ✅ FASE 5: Motor de Batalha (CONCLUÍDO)
- [x] GameService: O cérebro invisível do jogo. 🧠
- [x] Algoritmos de Combate (Atacante vs Defensor). 🏹
- [x] Relatórios Detalhados com Baixas e Saque de Recursos. 📑
- [x] Segurança Diplomática: Acesso restrito a logs de guerra. 🛡️

## ✅ FASE 6: Operações de Combate (CONCLUÍDO)
- [x] Lançamento de Ataques de Saque. 💣
- [x] Movimentos de Tropas em Tempo Real. 🚢
- [x] Defesa automática baseada em Muralhas. 🏰
- [x] Alertas de ataque hostil no Dashboard. ⚠️

## ✅ FASE 7: Diplomacia & Poder Mundial (CONCLUÍDO)
- [x] Ranking Mundial de Generais (Pontuação por Edifícios). 🏅
- [x] **Fundação de Alianças (Coligações)**. 🤝
- [x] **Sistema de Recrutamento (Pedir Adesão / Aprovar)**. 📉
- [x] Tags Militares visíveis no Ranking (Ex: `admin [NATO]`). 🎖️

## ✅ FASE 8: Polimento HUD & AJAX (CONCLUÍDO)
- [x] Dashboard Ultra-Fluido: Upgrades sem Refresh. ⚡
- [x] Sistema de Notificações "Toast" no ecrã. 🛰️
- [x] Sincronização instantânea de recursos após ordens. 💰
- [x] Interface de Batalha Industrial com tabelas detalhadas. 📊

## ✅ FASE 9: Expansão Territorial & Conquistas (CONCLUÍDO)
- [x] **Sistema de Conquista**: Capturar as bases dos outros jogadores. 🏁
- [x] Colonização de slots vazios no mapa. 📍
- [x] Múltiplas bases por jogador (Switch de Bases no Dashboard). 🏰🏰🏰
- [x] Visual Overhaul: Village View & High Contrast. 🏛️✨

## ✅ FASE 10: Comunicação & Inteligência em Tempo Real (CONCLUÍDO)
- [x] **Chat da Aliança**: Canal seguro com polling e alertas sonoros. 💬🔊
- [x] **Feed de Notícias de Guerra**: Atividades globais visíveis no Dashboard. 🌍
- [x] **HUD Industrial**: Visualização de produção p/min (+X p/min). 💰
- [x] **Mapa Tático 2.0**: Diferenciação de cores para aliados/inimigos. 🗺️🛰️

## ✅ FASE 11: Correio Militar & Relatórios Táticos (CONCLUÍDO)
- [x] **Caixa de Entrada (Inbox)**: Mensagens privadas entre jogadores. 📨
- [x] **Relatórios Automáticos**: Resultados de batalhas, saques e baixas diretamente na Inbox. ⚔️
- [x] **Filtros de Comunicação**: Separação de mensagens do Sistema, Ofensiva, Defensiva e Privadas. 🗂️
- [x] **Badge de Notificações**: Alertas de mensagens não lidas no painel de comando. 🔔

---

## 🚀 PRÓXIMAS MISSÕES (DOMÍNIO TOTAL)

## ✅ FASE 12: Espionagem & Informação Avançada (CONCLUÍDO)
- [x] Missões de Espionagem: Implementar o tipo de missão "Espionagem" no AttackModal. 🕵️
- [x] Relatórios de Espionagem: Revelar nível de edifícios e tropas estacionadas. 📋
- [x] **Radar Anti-Ataque**: Detecção de ataques em curso com aviso sonoro. 📡
- [x] **Quadro de Honra Mundial**: Log global de conquistas massivas. 🏆

## ✅ FASE 13: Logística Avançada & Comércio (CONCLUÍDO)
- [x] **Centro Logístico (Mercado)**: Edifício para troca de recursos entre jogadores. 💹
- [x] **Comboios de Mantimentos**: Unidades para transporte de recursos. 🚛
- [x] **Troca Interna**: Sistema de conversão rápida de recursos. 🔄

### ✅ FASE 14: Profundidade do Motor de Batalha (CONCLUÍDO)
- [x] **Sistema de Moral**: Penalização baseada na diferença de pontos. 📉
- [x] **Fator Sorte**: Variável aleatória de +/- 25% no combate. 🎲
- [x] **Bónus Noturno**: Dobro da defesa em horários de repouso. 🌙
- [x] **Especialização de Tropas**: Divisão Ofensiva/Defensiva clara. 🛡️🏹

### ✅ FASE 15: Estrutura Governamental de Alianças (CONCLUÍDO)
- [x] **Protocolos de Convite**: Sistema de recrutamento ativo pela liderança. 📨
- [x] **Diplomacia Visual no Mapa**: Cores para Aliados/PNA/Inimigos. 🗺️
- [x] **Fórum Interno**: Sistema de discussão estruturado. 🗣️
- [x] **Shared Reports**: Publicação de relatórios para a coligação. 📑

### 🎖️ FASE 16: O General (Sistema de Herói) [CONCLUÍDO]
- [x] Criação automática do General ao entrar no Dashboard.
- [x] Sistema de Experiência (XP) e Níveis (Curva Exponencial).
- [x] Árvore de Skills (Logística, Ofensiva, Defensiva, Saque, Recrutamento).
- [x] Integração no Motor de Batalha (Bónus Reais em combate).
- [x] Mobilização em Missões (O General viaja com as tropas).
- [x] Interface de Gestão (Alto Comando) com visual premium.

### ✅ FASE 17: Arsenal do General (Equipamentos) [CONCLUÍDO]
- [x] **Recrutamento em Massa**: Interface para todas as bases. 👥👥
- [x] **Templates de Construção**: Automatização de filas de espera. 🏗️
- [x] **Grupos de Bases**: Organização funcional de aldeias. 🗂️

### 🚀 FASE 18: Modernização & World Map 3.0 (EM PROGRESSO)
- [ ] **World Map 3.0**: Renderização massiva via WebGL/Canvas com zoom tático. 🗺️⚡
- [ ] **Estatísticas Dinâmicas**: Gráficos de evolução histórica e dashboards analíticos. 📈
- [ ] **PWA & Push Notifications**: Alertas nativos no telemóvel (fase final). 📲

---

## 🛠️ Notas de Engenharia
- **Stack**: Laravel 12 + React 18 + TypeScript + Inertia.js.
- **Estado**: **OPERACIONAL & EXPANDINDO** 🎖️
