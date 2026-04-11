/**
 * A ordem dos systems define o comportamento do jogo. Não alterar sem revisão.
 * systemsRegistry.ts - Doutrina de Execução Determinística v1.0.
 */
import { inputSystem } from './systems/InputSystem';
import { orderSystem } from './systems/OrderSystem';
import { aiSystem } from './systems/AISystem';
import { movementSystem } from './systems/MovementSystem';
import { combatSystem } from './systems/CombatSystem';
import { renderSystem } from './systems/RenderSystem';
 
/**
 * Interface obrigatória para todos os sistemas operativos.
 */
export interface GameSystem {
    init(): void;
    update(deltaTime: number): void;
    destroy(): void;
}
 
/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 * O GameLoop executa esta lista de forma sequencial e imutável.
 * 
 * ORDEM OPERATIVA:
 * 1. [PERCEPÇÃO] Input - Capta sinais brutos.
 * 2. [COMANDO] Order - Traduz cliques em intenções.
 * 3. [INTELIGÊNCIA] AI - Decide acções para unidades autónomas.
 * 4. [FÍSICA] Movement - Única autoridade sobre cinemática.
 * 5. [ATRTITO] Combat - Única autoridade sobre integridade (Health).
 * 6. [PROJECÇÃO] Render - Visualização final do estado validado.
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    inputSystem,
    orderSystem,
    aiSystem,
    movementSystem,
    combatSystem,
    renderSystem
];
