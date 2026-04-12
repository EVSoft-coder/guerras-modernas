import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { VelocityComponent } from '../components/Velocity';
import { Pathfinding } from '../../utils/Pathfinding';
import { RenderableComponent } from '../components/RenderableComponent';

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

        // 3. Configurar Cinética e Trajetória
        const path = Pathfinding.findPath(
            { x: originX, y: originY },
            { x: targetX, y: targetY },
            () => true // Caminho livre por agora
        );

        entityManager.addComponent(armyId, new VelocityComponent(0, 0, targetX, targetY, true, path || []));

        // 4. Visualização Táctica
        entityManager.addComponent(armyId, {
            type: 'Renderable',
            renderType: 'unit'
        } as RenderableComponent);

        console.log(`[WAR] Army ${armyId} launched from (${originX},${originY}) to (${targetX},${targetY})`);
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - War Room Offline.');
    }
}

export const attackSystem = new AttackSystem();
