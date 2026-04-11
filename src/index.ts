console.log("APP START");
/**
 * src/index.ts
 * Ponto de entrada e SimulaÃ§Ã£o de Engajamento COM IMAGENS.
 */
import { gameLoop } from './core/GameLoop';
import { inputSystem } from './game/systems/InputSystem';
import { uiManager } from './ui/UIManager';
import { entityManager } from './core/EntityManager';
import { Position, PositionComponent } from './game/components/Position';
import { Velocity, VelocityComponent } from './game/components/Velocity';
import { 
    HealthComponent, 
    AttackComponent, 
    AIComponent,
    SpriteComponent 
} from './game/components/BaseComponents';
import { PlayerComponent } from './game/components/PlayerComponent';
import { ResourceComponent } from './game/components/ResourceComponent';
import { VillageComponent } from './game/components/VillageComponent';
import { BuildingComponent } from './game/components/BuildingComponent';
import { BuildQueueComponent } from './game/systems/BuildQueueSystem';
import { systemsRegistry } from './game/systems/systemsRegistry';
import { stateManager, GameState } from './core/StateManager';
 
console.log("BEFORE GAMELOOP");
// 1. INICIALIZAÇÃO CORE (Sequência de Ignição)
// Nota: gameLoop.start() já orquestra a inicialização de todos os sistemas registrados.
gameLoop.start();

uiManager.initialize();

 
// 3. MOBILIZAÃ‡ÃƒO JOGADOR (UNIDADE ALFA + VILA)
const playerUnit = entityManager.createEntity();
entityManager.addComponent(playerUnit, new PlayerComponent());
entityManager.addComponent(playerUnit, new ResourceComponent(5000, 5000, 5000));
entityManager.addComponent(playerUnit, new BuildQueueComponent());
entityManager.addComponent(playerUnit, new VillageComponent('Vila Alfa'));
entityManager.addComponent(playerUnit, new PositionComponent(100, 200));
entityManager.addComponent(playerUnit, new VelocityComponent(0, 0));
entityManager.addComponent(playerUnit, new HealthComponent(1000, 1000));
entityManager.addComponent(playerUnit, new AttackComponent(50, 150, 1)); 
entityManager.addComponent(playerUnit, new SpriteComponent('/images/unidades/blindado_apc.png')); 
 
// 3.1. INFRAESTRUTURA DA VILA (EdifÃ­cios como Entidades com PosiÃ§Ã£o)
const qg = entityManager.createEntity();
entityManager.addComponent(qg, new BuildingComponent('Quartel General', 'HQ', 1, { x: 0, y: 0 }, playerUnit));

const mina = entityManager.createEntity();
entityManager.addComponent(mina, new BuildingComponent('Mina de Ferro', 'MINE', 1, { x: 1, y: 0 }, playerUnit));
 
console.log(`[BOOT] Player Unit Alpha (ID: ${playerUnit}) deployed with Spatial Village infrastructure.`);
 
// 3.1. MOBILIZAÃ‡ÃƒO TESTE (UNIDADE ALPHA-ZERO)
const testUnit = entityManager.createEntity();
entityManager.addComponent(testUnit, new PlayerComponent());
entityManager.addComponent(testUnit, new PositionComponent(0, 0));
entityManager.addComponent(testUnit, new VelocityComponent(0, 0));
entityManager.addComponent(testUnit, new SpriteComponent('/images/unidades/agente_espiao.png')); 
console.log(`[BOOT] Test Unit Alpha-Zero (ID: ${testUnit}) deployed at ORIGIN.`);
 
// 4. MOBILIZAÃ‡ÃƒO IA INIMIGA (UNIDADE OMEGA)
const enemyUnit = entityManager.createEntity();
entityManager.addComponent(enemyUnit, new PositionComponent(500, 200));
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new HealthComponent(2000, 2000));
entityManager.addComponent(enemyUnit, new AttackComponent(100, 200, 3)); 
entityManager.addComponent(enemyUnit, new AIComponent('AGGRESSIVE')); 
entityManager.addComponent(enemyUnit, new SpriteComponent('/images/unidades/tanque_combate.png'));
 
console.log(`[BOOT] Enemy Unit Omega (ID: ${enemyUnit}) detected with Main Battle Tank.`);
 
// 5. AUTORIZAÃ‡ÃƒO DE COMBATE
stateManager.forceState(GameState.PLAYING);

 
console.log('--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---');
