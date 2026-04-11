/**
 * systemsRegistry.ts
 * Registo mestre e ordem de batalha (ordem de execução dos systems).
 */
 
// Importação dos systems (placeholder para os existentes)
import { movementSystem } from './systems/MovementSystem';
// import { combatSystem } from './systems/CombatExpansion';
 
export interface GameSystem {
    update(deltaTime: number): void;
}
 
/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 * A ordem aqui define a precedência lógica (ex: mover antes de calcular dano).
 */
export const systemsRegistry: GameSystem[] = [
    movementSystem,
    // combatSystem, // Descomentar quando integrado
];
