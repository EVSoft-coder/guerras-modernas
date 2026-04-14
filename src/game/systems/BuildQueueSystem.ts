/**
 * src/game/systems/BuildQueueSystem.ts
 * GestÃ£o de Prioridades e Cronogramas de ConstruÃ§Ã£o e Upgrade.
 */
import { eventBus, EventPayload, Events } from '../../core/EventBus';
import { Component, entityManager } from '../../core/EntityManager';
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

export class BuildQueueComponent implements Component {
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

        // Tentar obter o proprietário através de busca de proximidade ou componente (Simplificado: assumimos o jogador 1 por agora se não houver ownerId)
        const ownerId = 1; 
        const resources = entityManager.getComponent<ResourceComponent>(ownerId, 'Resource');
        const buildQueue = entityManager.getComponent<BuildQueueComponent>(ownerId, 'BuildQueue');

        if (!resources || !buildQueue) {
            console.error(`[BUILD_SYSTEM] Owner ${ownerId} missing Resource or BuildQueue components.`);
            return;
        }

        // Custo Simples: 250 de cada recurso por nÃ­vel atual
        const cost = building.level * 250;
        const hasEnough = resources.suprimentos >= cost && resources.metal >= cost && resources.energia >= cost;

        if (hasEnough) {
            // Consumir (DESATIVADO - Backend é a source de verdade)
            // resources.suprimentos -= cost;
            // resources.metal -= cost;
            // resources.energia -= cost;

            // Enfileirar upgrade
            const upgradeTime = building.level * 10; // 10 segundos por nÃ­vel
            buildQueue.queue.push({
                type: 'UPGRADE',
                buildingType: building.buildingType,
                targetEntityId: buildingId,
                totalTime: upgradeTime,
                remainingTime: upgradeTime
            });

            console.log(`[BUILD_SYSTEM] Upgrade of ${building.buildingType} (LVL ${building.level} -> ${building.level + 1}) initiated.`);
            
            eventBus.emit({
                type: Events.BUILDING_REQUEST,
                entityId: ownerId,
                timestamp: Date.now(),
                data: { status: 'STARTED', buildingId }
            });
        } else {
            console.warn(`[BUILD_SYSTEM] Insufficient resources for upgrade of ${building.buildingType}. Required: ${cost}`);
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
                // building.level += 1; // DESATIVADO - O backend define o nível real
                console.log(`[BUILD_SYSTEM] Building ${building.buildingType} upgraded logic handled by backend.`);
                
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
