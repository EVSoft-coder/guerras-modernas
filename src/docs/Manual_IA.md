# Doutrina de Desenvolvimento — Guerras Modernas (IA Edition) 🧠🎖️
 
Esta arquitetura foi desenhada para permitir que múltiplos Agentes IA colaborem sem conflitos. Toda a intervenção deve respeitar estas regras.
 
## ⚖️ As Leis Universais
 
1.  **Imutabilidade do Core**: Nenhuma IA pode alterar os ficheiros em `/src/core`. O `GameLoop`, `EventBus` e `StateManager` são sagrados.
2.  **Soberania do EventBus**: Toda a comunicação entre o Jogo (Game) e a Interface (UI) deve ser feita exclusivamente via `eventBus.emit()` e `eventBus.subscribe()`. 
3.  **Matriz ECS**: 
    - **Components**: Dados puros apenas. Sem métodos de lógica.
    - **Entities**:IDs numéricos. Não devem conter métodos.
    - **Systems**: Toda a lógica vive aqui. Devem operar sobre o `EntityManager`.
 
## 🛠️ Como Estender o Sistema
 
### Adicionar uma nova Unidade
1.  Crie novos Componentes em `/src/game/components`.
2.  Crie um novo Sistema em `/src/game/systems`.
3.  Injete o `Update()` do novo sistema no `index.ts`.
 
### Adicionar Novos Controlos
1.  Adicione o sensor no `InputSystem.ts`.
2.  Emita um evento (ex: `BOMB_DROPPED`).
3.  O `CombatSystem` subscreve o evento e processa o dano.
 
---
**Assinado: Diretor de Arquitetura Tática.** 🫡
