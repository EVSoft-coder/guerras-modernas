/**
 * src/index.ts
 * Ponto de entrada e inicialização global.
 */
import { gameLoop } from './core/GameLoop';
import { inputSystem } from './input/InputSystem';
import { uiManager } from './ui/UIManager';
import { entityManager } from './game/entities/EntityManager';
import { PositionComponent, VelocityComponent } from './game/components/BaseComponents';
import { movementSystem } from './game/systems/MovementSystem';
import { eventBus } from './core/EventBus';
import { stateManager, GameState } from './core/StateManager';
 
// 1. Inicializar Sistemas de Suporte
inputSystem.initialize();
uiManager.initialize();
 
// 2. Mobilar o Campo de Batalha (Exemplo de Entidade)
const playerEntity = entityManager.createEntity();
entityManager.positions.set(playerEntity, new PositionComponent(100, 100));
entityManager.velocities.set(playerEntity, new VelocityComponent(50, 0)); // Move-se para a direita
 
console.log(`[INIT] Unit Alpha (ID: ${playerEntity}) deployed at 100, 100.`);
 
// 3. Configurar Loop de Atualização
// Injetamos os sistemas no ciclo do GameLoop
(gameLoop as any).update = (deltaTime: number) => {
    movementSystem.update(deltaTime);
    
    // Telemetria tática para o HUD
    const pos = entityManager.positions.get(playerEntity);
    if (pos && Math.floor(pos.x) % 100 === 0) {
        uiManager.updateHUD({ health: 100, score: Math.round(pos.x) });
    }
};
 
// 4. Iniciar Operações
stateManager.changeState(GameState.PLAYING);
gameLoop.start();
 
console.log('--- MISSION START: MODERN WARS ENGINE ACTIVE ---');
