# 🪖 Guerras Modernas - Strategy Engine

Um clone moderno e militarizado do clássico *Tribal Wars*, construído com as melhores práticas do ecossistema Laravel.

## 🚀 Tecnologias
- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Blade & Vanilla CSS (Preparado para Inertia.js + React/TypeScript)
- **Base de Dados:** MySQL / MariaDB
- **Automação:** Processamento via Cron / Jobs (Produção de recursos e filas de construção)

## 🛠️ Instalação Local

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/EVSoft-coder/guerras-modernas.git
   cd guerras-modernas
   ```

2. **Configurar Ambiente:**
   ```bash
   cp .env.example .env
   # Edite o .env com as suas credenciais de base de dados
   php artisan key:generate
   ```

3. **Dependências:**
   ```bash
   composer install
   npm install && npm run dev
   ```

4. **Base de Dados:**
   ```bash
   php artisan migrate --seed
   ```

## 🌐 Deploy em Servidor Shared (Ex: OVH)

O projeto está otimizado para correr em ambientes de alojamento partilhado. Siga estes passos:

1. Carregue os ficheiros para o servidor.
2. Certifique-se que o diretório `public/` é o **root** do domínio.
3. Crie o link simbólico para o storage:
   ```bash
   php artisan storage:link
   ```
4. **Importante:** Configure o **Cron Job** no painel da OVH para correr a cada minuto:
   ```bash
   * * * * * cd /caminho/do/projeto && php artisan schedule:run >> /dev/null 2>&1
   ```

## 🎮 Game Design
- **Recursos:** Suprimentos, Combustível, Munições e Pessoal.
- **Unidades:** Infantaria, Blindados, Helicópteros e Agentes Especiais.
- **Infraestrutura:** Mais de 8 tipos de edifícios com progressão não-linear.

## 📄 Licença
Propriedade de **EVSoft**. Todos os direitos reservados.
