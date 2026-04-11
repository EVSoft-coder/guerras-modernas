/**
 * systemsRegistry.ts
 * Registo Estático e Ordenado de Sistemas (Fase 3 - Ciclo Completo).
 */
import { inputSystem } from './systems/InputSystem';
import { movementSystem } from './systems/MovementSystem';
import { renderSystem } from './systems/RenderSystem';
import { GameSystem } from './systemsRegistry';
 
export { GameSystem };
 
/**
 * LISTA ESTÁTICA E ORDENADA DE SISTEMAS.
 * Categoria: [INPUT] -> [LOGIC] -> [STATE_MGR (Externo)] -> [RENDER] (Fila Final)
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    // --- [INPUT] ---
    inputSystem,
 
    // --- [LOGIC] ---
    movementSystem,
 
    // --- [RENDER] (Sempre por último no ciclo) ---
    renderSystem,
];
