/**
 * systemsRegistry.ts
 * Ordem de Batalha Estática e Documentada.
 */
import { inputSystem } from './systems/InputSystem';
import { movementSystem } from './systems/MovementSystem';
 
/**
 * Interface obrigatória para todos os sistemas do motor.
 */
export interface GameSystem {
    init(): void;
    update(deltaTime: number): void;
    destroy(): void;
}
 
/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 * Categoria: [INPUT] -> [LOGIC] -> [RENDER] (pendente)
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    // --- [INPUT] ---
    inputSystem,
 
    // --- [LOGIC] ---
    movementSystem,
 
    // --- [RENDER] (Fila Tática Futura) ---
];
