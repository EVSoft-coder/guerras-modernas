import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { VelocityComponent } from '../components/Velocity';
import { Pathfinding } from '../../utils/Pathfinding';
import { RenderableComponent } from '../components/RenderableComponent';
import { UnitComponent } from '../components/UnitComponent';
import { MarchComponent } from '../components/MarchComponent';
import { movementSystem } from './MovementSystem';

export class AttackSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AttackSystem - War Room Operational.');
        
        // Subscrever à ordem de lançamento de expedição
        eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
            this.launchAttack(payload.data);
        });
    }

    private launchAttack(data: any): void {
        const { originX, originY, targetX, targetY, ownerId, troops } = data;

        const armyId = entityManager.createEntity();
        
        // 1. Definir Identidade e Composição
        entityManager.addComponent(armyId, new ArmyComponent(ownerId, troops));
        
        // 2. Definir Posição Geográfica
        entityManager.addComponent(armyId, {
            type: 'GridPosition',
            x: originX,
            y: originY
        } as GridPositionComponent);

        // 3. Calcular Logística de Marcha
        const travelTimeSeconds = movementSystem.calculateMarchTime(
            { x: originX, y: originY },
            { x: targetX, y: targetY }
        );

        entityManager.addComponent(armyId, new MarchComponent(
            { x: originX, y: originY },
            { x: targetX, y: targetY },
            troops,
            Date.now(),
            Date.now() + (travelTimeSeconds * 1000)
        ));

        // 4. Configurar Cinética e Trajetória
        const path = Pathfinding.findPath(
            { x: originX, y: originY },
            { x: targetX, y: targetY },
            () => true // Caminho livre por agora
        );

        entityManager.addComponent(armyId, new VelocityComponent(0, 0, targetX, targetY, true, path || []));

        // 5. Visualização Táctica
        entityManager.addComponent(armyId, {
            type: 'Renderable',
            renderType: 'unit'
        } as RenderableComponent);

        // 6. Atributos de Combate Modernos (UnitComponent)
        const unitType = Object.keys(troops).includes('tanque_combate') ? 'tank' : 
                         Object.keys(troops).includes('helicoptero_ataque') ? 'drone' : 'infantry';

        entityManager.addComponent(armyId, new UnitComponent(
            unitType,
            120,    // Attack
            80,     // Defense
            25,     // Speed
            5000    // Capacity
        ));

        console.log(`[WAR] Army ${armyId} launched with MarchComponent. Arrival in ${travelTimeSeconds.toFixed(1)}s`);
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - War Room Offline.');
    }
}

export const attackSystem = new AttackSystem();
