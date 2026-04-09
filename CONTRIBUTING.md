# 📂 Guia de Contribuição - Guerras Modernas

Bem-vindo ao quartel-general de desenvolvimento. Este documento estabelece os protocolos para manter o código do projeto "Guerras Modernas" estável, limpo e profissional.

## 🛠️ Padrões de Código

- **PSR-12:** Todo o código PHP deve seguir rigorosamente as recomendações do PSR-12.
- **Strict Typing:** Sempre que possível, utilize tipagem estrita nos métodos e propriedades.
- **Blade & CSS:** Manter a estética "Premium" (Glassmorphism, Dark Mode) em todas as novas interfaces.
- **Naming:** Nomes de classes e métodos em Inglês (Padrão Laravel), mas campos de base de dados e termos de jogo podem ser em Português conforme o domínio.

## 🌿 Fluxo de Trabalho Git

1. **Branches:** Criar branches descritivas (ex: `feat/sistema-de-ataques`, `fix/charset-encoding`).
2. **Commits:** Seguir o padrão de Commits Convencionais:
   - `feat:` Novas funcionalidades.
   - `fix:` Correção de bugs.
   - `docs:` Alterações na documentação.
   - `style:` Formatação, falta de pontos e vírgulas, etc.
   - `refactor:` Alteração de código que não corrige um bug nem adiciona uma funcionalidade.

## 🛡️ Segurança e Performance

- **Transações:** Sempre que uma operação envolver múltiplas tabelas (ex: Registo, Combate), utilize `DB::transaction()`.
- **Validação:** Nunca valide dados diretamente nos controladores. Utilize **Form Requests**.
- **Indexes:** Adicione índices às tabelas de base de dados para colunas frequentemente filtradas (ex: `coordenadas`, `jogador_id`).

## 💬 Comunicação

Bugs críticos ou dúvidas arquiteturais devem ser reportados diretamente ao Arquiteto Principal.

---
🫡 *Foco, Disciplina e Código Limpo.*
