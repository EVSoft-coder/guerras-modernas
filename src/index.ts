/**
 * src/index.ts
 * Ponto de entrada e inicialização global (Sincronizado com Fase 1.5).
 */
import { gameLoop } from './core/GameLoop';
import { inputSystem } from './input/InputSystem';
import { uiManager } from './ui/UIManager';
import { entityManager } from './core/EntityManager';
import { PositionComponent, VelocityComponent } from './game/components/BaseComponents';
import { stateManager, GameState } from './core/StateManager';
 
// 1. INICIALIZAÇÃO CORE
gameLoop.init();
 
// 2. PREPARAÇÃO DE SENSORES E UI
inputSystem.initialize();
uiManager.initialize();
 
// 3. MOBILIZAÇÃO DE FORÇAS (Exemplo de Entidade Doutrinária)
const alphaUnit = entityManager.createEntity();
entityManager.addComponent(alphaUnit, new PositionComponent(0, 0) as any);
entityManager.addComponent(alphaUnit, new VelocityComponent(10, 0) as any);
 
console.log(`[DEPLOYMENT] Unit Alpha (ID: ${alphaUnit}) initialized at base coordinates.`);
 
// 4. IGNICÃO DO MOTOR
gameLoop.run();
 
console.log('--- OPERATIONS ACTIVE: DOCTRINE 1.1 ENFORCED ---');
