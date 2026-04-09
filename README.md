# 🎖️ Guerras Modernas - Motor de Jogo (v1.0 Alpha)

**Guerras Modernas** é um clone profissional e modernizado de Tribal Wars, com temática militar contemporânea. Desenvolvido em **Laravel 12 + React + TypeScript**, focado em alta performance, segurança e uma UI/UX de alto contraste inspirada em centros de comando táticos.

---

## 🛠️ Stack Tecnológica
- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React + TypeScript via Inertia.js
- **Assets:** Vite + Vanilla CSS (Custom Design System)
- **Base de Dados:** MySQL (UTF-8 mb4)
- **Automação:** Laravel Scheduler (Cron) para produção e combates real-time.

---

## 🚀 Instalação Rápida (Mobilização)

### 1. Clonar o Repositório
```bash
git clone https://github.com/EVSoft-coder/guerras-modernas.git
cd guerras-modernas
```

### 2. Configurar Ambiente
```bash
cp .env.example .env
# Configure as suas credenciais de base de dados no .env
```

### 3. Instalar Dependências
```bash
composer install
npm install
```

### 4. Preparar Base de Dados
```bash
php artisan key:generate
php artisan migrate --seed
```

### 5. Compilar Assets e rodar o Motor
```bash
npm run build
# Opcional para desenvolvimento: npm run dev
```

### 6. Configurar o Cron (Vital para Produção de Recursos)
Adicione esta entrada no seu Crontab ou painel Plesk/cPanel:
```bash
* * * * * cd /caminho-para-o-projeto && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🛡️ Missões Concluídas (Roadmap v1.0)
- [x] **Arquitetura Core:** Implementação do `GameService` atómico para gestão de recursos e filas.
- [x] **Interface Tática:** Painel de Comando (Dashboard) com tickers real-time e HUD de alta visibilidade.
- [x] **Segurança Operacional:** Validação rigorosa de ordens via FormRequests e transações BD.
- [x] **Otimização de Assets:** Integração total com Vite e eliminação de conflitos de JavaScript.
- [x] **Correção de Encoding:** Purificação total de carateres UTF-8 e uso de Bootstrap Icons para estabilidade.

---

## 🎖️ Contribuição
Oficiais interessados em contribuir devem seguir os protocolos definidos no [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 Licença
Propriedade Intelectual da **EVSoft-coder**. Todos os direitos reservados.
