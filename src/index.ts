console.log("APP START");
/**
 * src/index.ts
 * Ponto de entrada e Simulação de Engajamento COM IMAGENS.
 */
import { gameLoop } from './core/GameLoop';
import { inputSystem } from './game/systems/InputSystem';
import { uiManager } from './ui/UIManager';
import { entityManager } from './core/EntityManager';
import { Position } from './game/components/Position';
import { Velocity } from './game/components/Velocity';
import { 
    HealthComponent, 
    AttackComponent, 
    AIComponent,
    SpriteComponent 
} from './game/components/BaseComponents';
import { PlayerComponent } from './game/components/PlayerComponent';
import { ResourceComponent } from './game/components/ResourceComponent';
import { systemsRegistry } from './game/systems/systemsRegistry';
import { stateManager, GameState } from './core/StateManager';
 
console.log("BEFORE GAMELOOP");
// 1. INICIALIZAÇÃO CORE (Preparação de Monitores)
gameLoop.init();
 
// 2. INICIALIZAÇÃO DE SUBSISTEMAS OPERATIVOS
console.log('[BOOT] Initializing Modern Wars Engine with VISUALS...');
for (const system of systemsRegistry) {
    system.init();
}
uiManager.initialize();
 
// 3. MOBILIZAÇÃO JOGADOR (UNIDADE ALFA)
const playerUnit = entityManager.createEntity();
entityManager.addComponent(playerUnit, new PlayerComponent());
entityManager.addComponent(playerUnit, new ResourceComponent(1000, 1000, 1000));
entityManager.addComponent(playerUnit, new Position(100, 200));
entityManager.addComponent(playerUnit, new Velocity(0, 0));
entityManager.addComponent(playerUnit, new HealthComponent(1000, 1000));
entityManager.addComponent(playerUnit, new AttackComponent(50, 150, 1)); 
entityManager.addComponent(playerUnit, new SpriteComponent('/images/unidades/blindado_apc.png')); 
 
console.log(`[BOOT] Player Unit Alpha (ID: ${playerUnit}) deployed with APC armor.`);
 
// 3.1. MOBILIZAÇÃO TESTE (UNIDADE ALPHA-ZERO)
const testUnit = entityManager.createEntity();
entityManager.addComponent(testUnit, new PlayerComponent());
entityManager.addComponent(testUnit, new Position(0, 0));
entityManager.addComponent(testUnit, new Velocity(0, 0));
entityManager.addComponent(testUnit, new SpriteComponent('/images/unidades/agente_espiao.png')); 
console.log(`[BOOT] Test Unit Alpha-Zero (ID: ${testUnit}) deployed at ORIGIN.`);
 
// 4. MOBILIZAÇÃO IA INIMIGA (UNIDADE OMEGA)
const enemyUnit = entityManager.createEntity();
entityManager.addComponent(enemyUnit, new Position(500, 200));
entityManager.addComponent(enemyUnit, new Velocity(0, 0));
entityManager.addComponent(enemyUnit, new HealthComponent(2000, 2000));
entityManager.addComponent(enemyUnit, new AttackComponent(100, 200, 3)); 
entityManager.addComponent(enemyUnit, new AIComponent('AGGRESSIVE')); 
entityManager.addComponent(enemyUnit, new SpriteComponent('/images/unidades/tanque_combate.png'));
 
console.log(`[BOOT] Enemy Unit Omega (ID: ${enemyUnit}) detected with Main Battle Tank.`);
 
// 5. AUTORIZAÇÃO DE COMBATE
stateManager.forceState(GameState.PLAYING);
gameLoop.run();
 
console.log('--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---');
