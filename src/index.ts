/**
 * src/index.ts
 * Ponto de entrada e ignição de fase 2.
 */
import { gameLoop } from './core/GameLoop';
import { uiManager } from './ui/UIManager';
import { entityManager } from './core/EntityManager';
import { PositionComponent, VelocityComponent } from './game/components/BaseComponents';
import { systemsRegistry } from './game/systemsRegistry';
import { stateManager, GameState } from './core/StateManager';
 
// 1. INICIALIZAÇÃO CORE
gameLoop.init();
 
// 2. INICIALIZAÇÃO DE SISTEMAS DA ORDEM DE BATALHA
console.log('[INIT] Initializing Battle Systems...');
for (const system of systemsRegistry) {
    system.init();
}
 
// 3. UI E MONITORES
uiManager.initialize();
 
// 4. MOBILIZAÇÃO DE UNIDADE ALFA
const alphaUnit = entityManager.createEntity();
entityManager.addComponent(alphaUnit, new PositionComponent(0, 0));
entityManager.addComponent(alphaUnit, new VelocityComponent(10, 0)); // 10px/s para a direita
 
console.log(`[BOOT] Operation Alpha (ID: ${alphaUnit}) is set for maneuver.`);
 
// 5. AUTORIZAÇÃO DE COMBATE
stateManager.forceState(GameState.PLAYING);
gameLoop.run();
 
console.log('--- MISSION STATUS: PHASE 2 OPERATIONAL ---');
