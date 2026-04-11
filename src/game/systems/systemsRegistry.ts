/**
 * A ordem dos systems define o comportamento do jogo. Não alterar sem revisão.
 * systemsRegistry.ts - Doutrina de Execução Determinística v1.1 (Phases).
 */
import { inputSystem } from './InputSystem';
import { timeSystem } from './TimeSystem';
import { resourceSystem } from './ResourceSystem';
import { orderSystem } from './OrderSystem';
import { aiSystem } from './AISystem';
import { movementSystem } from './MovementSystem';
import { combatSystem } from './CombatSystem';
import { renderSystem } from './RenderSystem';
 
/**
 * Interface operativa com estratificação de fases.
 */
export interface GameSystem {
    init(): void;
    
    // Fases de Execução
    preUpdate(deltaTime: number): void;
    update(deltaTime: number): void;
    postUpdate(deltaTime: number): void;
    
    destroy(): void;
}
 
/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    inputSystem,
    timeSystem,
    resourceSystem,
    orderSystem,
    aiSystem,
    movementSystem,
    combatSystem,
    renderSystem
];
