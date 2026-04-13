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
import { marchSystem } from './MarchSystem';
import { visionSystem } from './VisionSystem';
import { ResearchSystem } from './ResearchSystem';
import { renderSystem } from './RenderSystem';
import { RebelGeneratorSystem } from './RebelGeneratorSystem';
import { syncSystem } from './SyncSystem';
import { IntelSystem } from './IntelSystem';
import { worldMapSyncSystem } from './WorldMapSyncSystem';
import { systemIntegrityCheck } from './SystemIntegrityCheck';

const intelSystem = new IntelSystem();

import { GameSystem } from './types';

/**
 * LISTA EXPLÍCITA E ORDENADA DE SISTEMAS.
 */
export const systemsRegistry: ReadonlyArray<GameSystem> = [
    systemIntegrityCheck,
    inputSystem,
    gameModeSystem,
    timeSystem,
    worldSystem,
    intelSystem,
    resourceSystem,
    buildQueueSystem,
    orderSystem,
    aiSystem,
    movementSystem,
    combatSystem,
    marchSystem,
    attackSystem,
    new RebelGeneratorSystem(),
    visionSystem,
    new ResearchSystem(),
    renderSystem,
    worldMapSyncSystem,
    syncSystem
];
