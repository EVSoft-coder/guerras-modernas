# 🎖️ Guerras Modernas - Military Strategy Operation 🛰️

![Modern Warfare Banner](https://img.shields.io/badge/Status-OPERATIONAL-success?style=for-the-badge&logo=opsgenie)
![Version](https://img.shields.io/badge/Version-1.2.0--ALPHA-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-LARAVEL%2012%20%2B%20REACT-red?style=for-the-badge)

## 📋 Sumário Executivo
**Guerras Modernas** é um simulador de estratégia militar persistente (MMOSG) inspirado no clássico Tribal Wars, mas reimaginado para o cenário de conflitos contemporâneos. Comande bases, gerencie recursos industriais, pesquise tecnologias de ponta e lidere exércitos de infantaria e blindados em busca da supremacia global.

---

## 🛠️ Arsenal Tecnológico
*   **Núcleo Inteligente:** Laravel 12 (PHP 8.2+)
*   **Interface Tática:** Blade + React/Inertia (v2) + TypeScript
*   **Estética Dominante:** Glassmorphism Dark UI com animações Micro-Tactical
*   **Base de Operações:** MySQL / MariaDB
*   **Processamento de Combate:** Algoritmo atómico com suporte a Saques (Loot) e Capacidade de Carga

---

## 🚀 Protocolo de Instalação (Local)

### 1. Preparação de Terreno
```bash
git clone https://github.com/EVSoft-coder/guerras-modernas.git
cd guerras-modernas
```

### 2. Comissionamento de Dependências
```bash
composer install
npm install
```

### 3. Configuração de Inteligência
```bash
cp .env.example .env
php artisan key:generate
```
*Configure as credenciais da sua Base de Dados no ficheiro `.env`.*

### 4. Deploy de Infraestrutura (BD)
```bash
php artisan migrate --seed
```

### 5. Ativação de Sistemas
```bash
php artisan serve
npm run dev
```

---

## 🗺️ Roadmap de Operações
- [x] **Fase 1: Estabilização** - Purificação UTF-8 e Saneamento de Erros JS.
- [x] **Fase 2: Core Gameplay** - Produção de recursos, filas de construção e treino de tropas.
- [x] **Fase 3: Logística Avançada** - Sistema de saques, proteção de novatos e otimização mobile.
- [ ] **Fase 4: Diplomacia Total** - Alianças avançadas, chat em tempo real e fórum militar.
- [ ] **Fase 5: Guerra Total** - Sistema de mísseis, aviação avançada e conquista de capitais.

---

## 🛡️ Protocolo de Segurança (Beginner Protection)
Jogadores recém-alistados gozam de **24 horas de imunidade diplomática**. Durante este período, não podem ser atacados por outros comandantes, garantindo tempo para estabelecer a infraestrutura básica.

---

## 🎖️ Contribuição e Comando
Consulte o ficheiro [CONTRIBUTING.md](CONTRIBUTING.md) para entender as regras de engajamento do nosso departamento de I&D.

---

## 🎖️ Como Testar Hoje (Versão 1.3-ALPHA)

Para verificar o estado atual do comando, siga estes procedimentos:

1.  **Acesso:** Entre em `/dashboard` e verifique a limpeza total do console e do encoding.
2.  **Economia:** Observe o ticker de recursos em tempo real no HUD superior.
3.  **Engenharia:** Construa um edifício (ex: Minas) e observe a fila de construção atómica.
4.  **Logística Mobilizada:** Selecione o **Mapa Tático**, escolha uma base hostil e lance uma ofensiva. Note que o tempo de chegada agora respeita a velocidade da unidade mais lenta do seu batalhão.
5.  **Reconhecimento:** Utilize o **Simulador Tático** no Dashboard para prever baixas antes de enviar tropas reais.

---

**Comandante:** "A vitória favorece os preparados." 🫡⚔️
