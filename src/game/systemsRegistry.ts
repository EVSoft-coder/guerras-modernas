/**
 * systemsRegistry.ts
 * Registo Estático e Ordenado de Sistemas (Ordem de Batalha).
 */
import { movementSystem } from './systems/MovementSystem';
// import { combatSystem } from './systems/CombatExpansion';
 
export interface GameSystem {
    update(deltaTime: number): void;
}
 
/**
 * LISTA ESTÁTICA EXPLICITA.
 * A ordem aqui define a precedência lógica invariável.
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    movementSystem,
    // combatSystem, // Implementar em fase de expansão
];
