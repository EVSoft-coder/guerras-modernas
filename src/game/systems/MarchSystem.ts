import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { MarchComponent } from '../components/MarchComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { ArmyComponent } from '../components/ArmyComponent';
import { Logger } from '../../core/Logger';

export class MarchSystem implements GameSystem {
    public init(): void {
        Logger.info('[SYSTEM] MarchSystem - Logistics Engine ONLINE.');
        
        // Listen for attack launches to create new marches
        eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
            this.createMarch(payload.data);
        });
    }

    public update(deltaTime: number): void {
        const now = Date.now();
        const marchEntities = entityManager.getEntitiesWith(['March']);

        for (const entityId of marchEntities) {
            const march = entityManager.getComponent<MarchComponent>(entityId, 'March');
            if (!march) continue;

            // 1. ARRIVAL LOGIC
            if (march.status === 'going' && now >= march.arrivalTime) {
                Logger.building('MARCH_ARRIVAL', { id: entityId, target: `${march.targetX}:${march.targetY}` });
                
                // Transfer responsibility to combat/resolution systems
                eventBus.emit(Events.ATTACK_ARRIVED, {
                    entityId: entityId,
                    timestamp: now,
                    data: { march }
                });

                // Status usually changed by resolution systems, but we mark it to prevent repeat triggers
                march.status = 'completed'; 
            }

            // 2. RETURN LOGIC
            if (march.status === 'returning' && now >= march.returnTime) {
                Logger.building('MARCH_RETURNED', { id: entityId, origin: `${march.originX}:${march.originY}` });
                
                eventBus.emit(Events.ATTACK_RETURNED, {
                    entityId: entityId,
                    timestamp: now,
                    data: { march }
                });

                // Reintegration happens in AttackSystem (for now), but MarchSystem manages the entity death
                entityManager.removeEntity(entityId);
            }
        }
    }

    private createMarch(data: any): void {
        const { originX, originY, targetX, targetY, ownerId, troops, tipo } = data;

        // Simple mission ID
        const missionId = `MSN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const entityId = entityManager.createEntity();
        
        // 1. Composition
        entityManager.addComponent(entityId, new ArmyComponent(ownerId, troops));
        
        // 2. Initial Grid Positioning
        entityManager.addComponent(entityId, new GridPositionComponent(originX, originY, true));

        // 3. Logic & Timing
        const dx = targetX - originX;
        const dy = targetY - originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Timing constants (matched with AttackSystem for consistency during refactor)
        const baseSpeed = 10; 
        const travelMultiplier = 5;
        const travelTimeMs = (distance / baseSpeed) * (3600 / travelMultiplier) * 1000;

        entityManager.addComponent(entityId, new MarchComponent(
            missionId,
            originX,
            originY,
            targetX,
            targetY,
            troops,
            Date.now(),
            Date.now() + (travelTimeMs || 5000), // Min 5s for debug visibility
            Date.now() + ((travelTimeMs || 5000) * 2), 
            'going',
            tipo || 'ataque',
            ownerId
        ));

        // 4. Type Tagging
        entityManager.addComponent(entityId, { type: 'Army' });

        Logger.info(`[MARCH] DEPLOYED: Mission ${missionId} for Entity ${entityId}. ETA: ${((travelTimeMs || 5000) / 1000).toFixed(1)}s`);
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}

export const marchSystem = new MarchSystem();
