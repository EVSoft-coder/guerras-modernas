/**
 * systemsRegistry.ts
 * Ordem de Batalha (Fase 6 - SISTEMA DE ORDENS).
 */
import { inputSystem } from './systems/InputSystem';
import { orderSystem } from './systems/OrderSystem';
import { aiSystem } from './systems/AISystem';
import { movementSystem } from './systems/MovementSystem';
import { combatSystem } from './systems/CombatSystem';
import { renderSystem } from './systems/RenderSystem';
import { GameSystem } from './systemsRegistry';
 
export { GameSystem };
 
/**
 * LISTA ESTÁTICA EXPLICITA - FUNDAMENTAL PARA O DETERMINISMO.
 * Categoria: [INPUT] -> [ORDERS] -> [IA] -> [LOGIC] -> [COMBAT] -> [RENDER]
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    // --- [INPUT] ---
    inputSystem,
 
    // --- [ORDERS] (Comando Humano) ---
    orderSystem,
 
    // --- [IA] (Decisão Autónoma) ---
    aiSystem,
 
    // --- [LOGIC] (Física e Manobras) ---
    movementSystem,
 
    // --- [COMBAT] (Atrito e Dano) ---
    combatSystem,
 
    // --- [RENDER] (Projeção Visual Final) ---
    renderSystem,
];
