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
import { GridPositionComponent } from './game/components/GridPositionComponent';
import { RenderableComponent } from './game/components/RenderableComponent';
import { 
    HealthComponent, 
    AttackComponent, 
    AIComponent,
    SpriteComponent 
} from './game/components/BaseComponents';
import { ProductionComponent } from './game/components/ProductionComponent';
import { PlayerComponent } from './game/components/PlayerComponent';
import { ResourceComponent } from './game/components/ResourceComponent';
import { VillageComponent } from './game/components/VillageComponent';
import { BuildingComponent } from './game/components/BuildingComponent';
import { VisionComponent } from './game/components/VisionComponent';
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

const villageEntity = entityManager.createEntity();
entityManager.addComponent(villageEntity, new VillageComponent(
    playerUnit, 
    1, 
    { suprimentos: 5000, combustivel: 5000, municoes: 5000, pessoal: 100, metal: 5000, energia: 5000 }, 
    'Vila Alfa'
));
entityManager.addComponent(villageEntity, new ResourceComponent(5000, 5000, 5000, 5000, 5000, 100, 20000));
entityManager.addComponent(villageEntity, new VisionComponent(5));
entityManager.addComponent(villageEntity, new GridPositionComponent(5, 5));
entityManager.addComponent(villageEntity, {
    type: "Renderable",
    renderType: "building"
} as RenderableComponent);

const villageBeta = entityManager.createEntity();
entityManager.addComponent(villageBeta, new VillageComponent(
    playerUnit, 
    1, 
    { suprimentos: 2000, combustivel: 2000, municoes: 2000, pessoal: 50, metal: 2000, energia: 2000 }, 
    'Base Beta'
));
entityManager.addComponent(villageBeta, new ResourceComponent(2000, 2000, 2000, 2000, 2000, 50, 10000));
entityManager.addComponent(villageBeta, new VisionComponent(5));
entityManager.addComponent(villageBeta, new GridPositionComponent(15, 10));
entityManager.addComponent(villageBeta, {
    type: "Renderable",
    renderType: "building"
} as RenderableComponent);

entityManager.addComponent(playerUnit, new ResourceComponent(5000, 5000, 5000, 5000, 5000, 500));
entityManager.addComponent(playerUnit, new BuildQueueComponent());
entityManager.addComponent(playerUnit, new VisionComponent(10));
// entityManager.addComponent(playerUnit, new PositionComponent(100, 200)); // Deprecado
entityManager.addComponent(playerUnit, new VelocityComponent(0, 0));
entityManager.addComponent(playerUnit, new HealthComponent(1000, 1000));
entityManager.addComponent(playerUnit, new AttackComponent(50, 150, 1)); 
entityManager.addComponent(playerUnit, new SpriteComponent('/images/unidades/blindado_apc.png')); 

// Componentes TÃ¡cticos de Grelha (Doutrina Requisitada)
entityManager.addComponent(playerUnit, new GridPositionComponent(6, 5));

entityManager.addComponent(playerUnit, {
    type: "Renderable",
    renderType: "unit"
} as RenderableComponent);
const qg = entityManager.createEntity();
entityManager.addComponent(qg, new BuildingComponent('HQ', 1, villageEntity));

const minaMetal = entityManager.createEntity();
entityManager.addComponent(minaMetal, new BuildingComponent('mina_metal', 1, villageEntity));
entityManager.addComponent(minaMetal, new ProductionComponent('metal', 5)); // 5 metal/s

const centralEnergia = entityManager.createEntity();
entityManager.addComponent(centralEnergia, new BuildingComponent('central_energia', 1, villageEntity));
entityManager.addComponent(centralEnergia, new ProductionComponent('energia', 10)); // 10 energia/s

const minaSuprimentos = entityManager.createEntity();
entityManager.addComponent(minaSuprimentos, new BuildingComponent('mina_suprimentos', 1, villageEntity));
entityManager.addComponent(minaSuprimentos, new ProductionComponent('suprimentos', 20));

console.log(`[BOOT] Player Unit Alpha (ID: ${playerUnit}) deployed with Spatial Village infrastructure.`);
 
// 3.1. MOBILIZAÃ‡ÃƒO TESTE (UNIDADE ALPHA-ZERO)
const testUnit = entityManager.createEntity();
entityManager.addComponent(testUnit, new PlayerComponent());
entityManager.addComponent(testUnit, new VelocityComponent(0, 0));
entityManager.addComponent(testUnit, new SpriteComponent('/images/unidades/agente_espiao.png')); 
console.log(`[BOOT] Test Unit Alpha-Zero (ID: ${testUnit}) deployed at ORIGIN.`);
 
// 4. MOBILIZAÃ‡ÃƒO IA INIMIGA (UNIDADE OMEGA)
const enemyUnit = entityManager.createEntity();
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new HealthComponent(2000, 2000));
entityManager.addComponent(enemyUnit, new AttackComponent(100, 200, 3)); 
entityManager.addComponent(enemyUnit, new AIComponent('AGGRESSIVE')); 
entityManager.addComponent(enemyUnit, new SpriteComponent('/images/unidades/tanque_combate.png'));
 
console.log(`[BOOT] Enemy Unit Omega (ID: ${enemyUnit}) detected with Main Battle Tank.`);

// Componentes Visuais Inimigo (Doutrina Requisitada)
entityManager.addComponent(enemyUnit, new GridPositionComponent(10, 10));

entityManager.addComponent(enemyUnit, {
    type: "Renderable",
    renderType: "unit"
} as RenderableComponent);

// 5. MOBILIZAÇÃO DE REDUTOS REBELDES (Operação Alpha-Rebel)
const rebelCoords = [
    { x: 7, y: 5, name: 'Reduto Insurgente A' },
    { x: 5, y: 7, name: 'Célula de Resistência B' },
    { x: 3, y: 5, name: 'Posto Rebelde Gamma' },
    { x: 5, y: 3, name: 'Depósito Insurgente Delta' },
    { x: 7, y: 7, name: 'Base Terrorista Epsilon' }
];

rebelCoords.forEach((coord, index) => {
    const rebelVillage = entityManager.createEntity();
    entityManager.addComponent(rebelVillage, new VillageComponent(
        null, 
        Math.floor(Math.random() * 3) + 1, // Nível 1 a 3
        { suprimentos: 1000, combustivel: 1000, municoes: 1000, pessoal: 20, metal: 1000, energia: 1000 }, 
        coord.name,
        true // isRebel = true
    ));
    entityManager.addComponent(rebelVillage, new ResourceComponent(1000, 1000, 1000, 1000, 1000, 20, 5000));
    entityManager.addComponent(rebelVillage, new GridPositionComponent(coord.x, coord.y));
    entityManager.addComponent(rebelVillage, new PositionComponent(coord.x * 80, coord.y * 80));
    entityManager.addComponent(rebelVillage, {
        type: "Renderable",
        renderType: "building"
    } as RenderableComponent);
    
    console.log(`[BOOT] Rebel Cell ${index + 1} (${coord.name}) deployed at ${coord.x}:${coord.y}.`);
});

stateManager.setState(GameState.PLAYING);

 
console.log('--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---');
