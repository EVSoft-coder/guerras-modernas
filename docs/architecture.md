# Arquitetura Estratégica: Doutrina Final 🧠🎖️

Este documento define os pilares estruturais e as leis imutáveis do motor central de jogo.

## 1. O Triumvirato Tático (CORE)

A fundação do sistema repousa em três módulos nucleares que residem em `/src/core/`.

### 🧩 Entity Manager
- **Soberania de Identidade**: Gere todos os IDs de entidades e o mapeamento de componentes.
- **Protocolo de Consulta**: O método `getEntitiesWith(componentType)` é a única via autorizada para sistemas filtrarem subordinados.
- **Gestão de Ativos**: Métodos `addComponent` e `removeEntity` garantem a integridade do inventário tático.

### 📡 Event Bus
- **Sinalização**: Todos os tipos de eventos devem ser declarados em `UPPER_CASE`.
- **Payload Obrigatório**: Todo o sinal emitido deve obedecer rigorosamente à estrutura:
  ```typescript
  { 
    entityId?: number, 
    timestamp: number, 
    data: any 
  }
  ```
- **Sincronização**: O `timestamp` é vital para a resolução de conflitos em sistemas assíncronos.

### ⚖️ State Manager
- **Soberania de Comando**: É o único componente autorizado a realizar alterações no estado global do simulador (`GameState`).
- **Blindagem Operacional**: Nenhum sistema externo pode modificar o estado sem a autorização do método `changeState()`.

---

## 2. Camadas Operacionais

- **Domain Layer**: Regras puras e constantes.
- **Service Layer**: Orquestração e persistência.
- **Interface Layer**: Apenas visualização, sem lógica de combate.

---
**ESTADO DE PRONTIDÃO: ABSOLUTO.** 🫡⚔️🚀
