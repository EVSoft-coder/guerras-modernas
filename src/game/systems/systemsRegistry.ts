/**
 * A ordem dos systems define o comportamento do jogo. Não alterar sem revisão.
 * systemsRegistry.ts - Doutrina de Execução Determinística v1.1 (Phases).
 */
import { inputSystem } from './InputSystem';
import { gameModeSystem } from './GameModeSystem';
import { timeSystem } from './TimeSystem';
import { worldSystem } from './WorldSystem';
import { resourceSystem } from './ResourceSystem';
import { buildQueueSystem } from './BuildQueueSystem';
import { orderSystem } from './OrderSystem';
import { aiSystem } from './AISystem';
import { movementSystem } from './MovementSystem';
import { combatSystem } from './CombatSystem';
import { attackSystem } from './AttackSystem';
import { visionSystem } from './VisionSystem';
import { ResearchSystem } from './ResearchSystem';
import { renderSystem } from './RenderSystem';
import { syncSystem } from './SyncSystem';

import { GameSystem } from './types';

/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    inputSystem,
    gameModeSystem,
    timeSystem,
    worldSystem,
    resourceSystem,
    buildQueueSystem,
    orderSystem,
    aiSystem,
    movementSystem,
    combatSystem,
    attackSystem,
    visionSystem,
    new ResearchSystem(),
    renderSystem,
    syncSystem
];
