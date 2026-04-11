/**
 * src/index.ts
 * Ponto de entrada e Simulação de Engajamento (Phase 5).
 */
import { gameLoop } from './core/GameLoop';
import { inputSystem } from './game/systems/InputSystem';
import { uiManager } from './ui/UIManager';
import { entityManager } from './core/EntityManager';
import { PositionComponent, VelocityComponent, HealthComponent, AttackComponent, AIComponent } from './game/components/BaseComponents';
import { systemsRegistry } from './game/systems/systemsRegistry';
import { stateManager, GameState } from './core/StateManager';
 
// 1. INICIALIZAÇÃO CORE (Preparação de Monitores)
gameLoop.init();
 
// 2. INICIALIZAÇÃO DE SUBSISTEMAS OPERATIVOS
console.log('[BOOT] Initializing Modern Wars Engine...');
for (const system of systemsRegistry) {
    system.init();
}
uiManager.initialize();
 
// 3. MOBILIZAÇÃO UNIDADE ALFA: JOGADOR
const alphaUnit = entityManager.createEntity();
entityManager.addComponent(alphaUnit, new PositionComponent(100, 100));
entityManager.addComponent(alphaUnit, new VelocityComponent(0, 0)); // Imóvel por defeito
entityManager.addComponent(alphaUnit, new HealthComponent(1000, 1000));
entityManager.addComponent(alphaUnit, new AttackComponent(50, 100, 2)); // 50 Dano, 100 Range, 2s Cooldown
 
console.log(`[DEPLOYMENT] Unit Alpha (PLAYER) - ID: ${alphaUnit} deployed at Front Line.`);
 
// 4. MOBILIZAÇÃO UNIDADE OMEGA: IA INIMIGA
const omegaUnit = entityManager.createEntity();
entityManager.addComponent(omegaUnit, new PositionComponent(400, 100));
entityManager.addComponent(omegaUnit, new VelocityComponent(0, 0));
entityManager.addComponent(omegaUnit, new HealthComponent(500, 500));
entityManager.addComponent(omegaUnit, new AttackComponent(25, 80, 1.5));
entityManager.addComponent(omegaUnit, new AIComponent('AGGRESSIVE')); // Vai perseguir o Jogador
 
console.log(`[DEPLOYMENT] Unit Omega (ENEMY_AI) - ID: ${omegaUnit} detected in the Sector.`);
 
// 5. AUTORIZAÇÃO DE COMBATE
stateManager.forceState(GameState.PLAYING);
gameLoop.run();
 
console.log('--- OPERATIONS ACTIVE: BATTLE ENGAGEMENT IN PROGRESS ---');
