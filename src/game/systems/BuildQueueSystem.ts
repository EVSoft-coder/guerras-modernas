/**
 * src/game/systems/BuildQueueSystem.ts
 * GestÃ£o de Prioridades e Cronogramas de ConstruÃ§Ã£o e Upgrade.
 */
import { eventBus, EventPayload, Events } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';
import { BuildingComponent } from '../components/BuildingComponent';
import { ResourceComponent } from '../components/ResourceComponent';
import { GameSystem } from './types';

export interface BuildItem {
    type: 'NEW' | 'UPGRADE';
    buildingType: string;
    targetEntityId?: number; // Para upgrades
    totalTime: number;
    remainingTime: number;
}

export class BuildQueueComponent {
    public readonly type = 'BuildQueue';
    constructor(public queue: BuildItem[] = []) {}
}

export class BuildQueueSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] BuildQueueSystem - Logistics Core ONLINE.');
        
        // Subscrever a requisiÃ§Ãµes de upgrade
        eventBus.subscribe(Events.BUILDING_UPGRADE_REQUEST, (payload: EventPayload) => {
            this.handleUpgradeRequest(payload);
        });
    }

    private handleUpgradeRequest(payload: EventPayload): void {
        const buildingId = payload.data.id;
        if (buildingId === undefined) return;

        const building = entityManager.getComponent<BuildingComponent>(buildingId, 'Building');
        if (!building) return;

        const ownerId = building.villageId;
        const resources = entityManager.getComponent<ResourceComponent>(ownerId, 'Resource');
        const buildQueue = entityManager.getComponent<BuildQueueComponent>(ownerId, 'BuildQueue');

        if (!resources || !buildQueue) {
            console.error(`[BUILD_SYSTEM] Owner ${ownerId} missing Resource or BuildQueue components.`);
            return;
        }

        // Custo Simples: 150 de cada recurso por nÃ­vel atual
        const cost = building.level * 150;
        const hasEnough = resources.wood >= cost && resources.stone >= cost && resources.iron >= cost;

        if (hasEnough) {
            // Consumir
            resources.wood -= cost;
            resources.stone -= cost;
            resources.iron -= cost;

            // Enfileirar upgrade
            const upgradeTime = building.level * 5; // 5 segundos por nÃ­vel
            buildQueue.queue.push({
                type: 'UPGRADE',
                buildingType: building.buildingType,
                targetEntityId: buildingId,
                totalTime: upgradeTime,
                remainingTime: upgradeTime
            });

            console.log(`[BUILD_SYSTEM] Upgrade of ${building.name} (LVL ${building.level} -> ${building.level + 1}) initiated for Player ${ownerId}.`);
            
            // Emitir evento de inÃ­cio opcionalmente
            eventBus.emit({
                type: Events.BUILDING_REQUEST,
                entityId: ownerId,
                timestamp: Date.now(),
                data: { status: 'STARTED', buildingId }
            });
        } else {
            console.warn(`[BUILD_SYSTEM] Insufficient resources for upgrade of ${building.name}. Required: ${cost}`);
        }
    }

    public update(deltaTime: number): void {
        const builders = entityManager.getEntitiesWith(['BuildQueue']);

        for (const id of builders) {
            const bq = entityManager.getComponent<BuildQueueComponent>(id, 'BuildQueue');
            if (bq && bq.queue.length > 0) {
                const task = bq.queue[0];
                task.remainingTime -= deltaTime;

                if (task.remainingTime <= 0) {
                    bq.queue.shift();
                    this.completeTask(task);
                }
            }
        }
    }

    private completeTask(task: BuildItem): void {
        if (task.type === 'UPGRADE' && task.targetEntityId !== undefined) {
            const building = entityManager.getComponent<BuildingComponent>(task.targetEntityId, 'Building');
            if (building) {
                building.level += 1;
                console.log(`[BUILD_SYSTEM] Building ${building.name} upgraded to Level ${building.level}!`);
                
                eventBus.emit({
                    type: Events.BUILDING_COMPLETED,
                    entityId: task.targetEntityId,
                    timestamp: Date.now(),
                    data: { buildingType: task.buildingType, newLevel: building.level }
                });
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] BuildQueueSystem - Logistics Core OFFLINE.');
    }
}

export const buildQueueSystem = new BuildQueueSystem();
