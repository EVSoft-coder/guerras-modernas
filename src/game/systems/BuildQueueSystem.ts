/**
 * src/game/systems/BuildQueueSystem.ts
 * Gestão de Prioridades e Cronogramas de Construção.
 */
import { eventBus, EventPayload, Events } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
import { buildingCosts } from '../config/buildingCosts';

export interface BuildItem {
    type: string;
    remainingTime: number;
}

export interface BuildQueueComponent {
    queue: BuildItem[];
}

export class BuildQueueSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] BuildQueueSystem - Logistics Core ONLINE.');
        
        // Subscrever à pulsação do tempo para processar filas
        eventBus.subscribe('GAME:TICK', () => {
            this.updateQueues();
        });

        // Subscrever a requisições de construção
        eventBus.subscribe(Events.BUILDING_REQUEST, (payload: EventPayload) => {
            this.handleBuildRequest(payload);
        });
    }

    private handleBuildRequest(payload: EventPayload): void {
        const { entityId, data } = payload;
        const { buildingType } = data;

        if (entityId === undefined || !buildingType) return;

        const costs = buildingCosts[buildingType];
        if (!costs) {
            console.warn(`[BUILD] Unknown building type: ${buildingType}`);
            return;
        }

        const resources = entityManager.getComponent<any>(entityId, 'Resource');
        if (!resources) {
            eventBus.emit({
                type: Events.BUILDING_FAILED,
                entityId,
                timestamp: Date.now(),
                data: { reason: 'NO_RESOURCES_ENTITY', buildingType }
            });
            return;
        }

        // Validação de recursos
        const hasEnough = 
            resources.wood >= costs.wood && 
            resources.stone >= costs.stone && 
            resources.iron >= costs.iron;

        if (hasEnough) {
            // Consumo imediato
            resources.wood -= costs.wood;
            resources.stone -= costs.stone;
            resources.iron -= costs.iron;

            // Inserção na fila
            const buildQueue = entityManager.getComponent<BuildQueueComponent>(entityId, 'BuildQueue');
            if (buildQueue) {
                // Tempo base de construção (pode ser expandido no config no futuro)
                const buildTime = 10; 
                buildQueue.queue.push({ type: buildingType, remainingTime: buildTime });
                
                console.log(`[BUILD] Construction started for ${buildingType} on Entity ${entityId}`);
            }
        } else {
            eventBus.emit({
                type: Events.BUILDING_FAILED,
                entityId,
                timestamp: Date.now(),
                data: { 
                    reason: 'INSUFFICIENT_RESOURCES', 
                    buildingType,
                    required: costs,
                    current: { wood: resources.wood, stone: resources.stone, iron: resources.iron }
                }
            });
        }
    }

    private updateQueues(): void {
        // Assume-se que as entidades que podem construir têm um componente 'BuildQueue'
        const entities = entityManager.getEntitiesWith(['BuildQueue']);

        for (const id of entities) {
            const buildQueue = entityManager.getComponent<BuildQueueComponent>(id, 'BuildQueue');
            
            if (buildQueue && buildQueue.queue.length > 0) {
                const activeTask = buildQueue.queue[0];
                
                // Decrementar tempo (1 tick = 1 segundo por defeito)
                activeTask.remainingTime -= 1;

                if (activeTask.remainingTime <= 0) {
                    // Tarefa Concluída
                    const completedTask = buildQueue.queue.shift();
                    
                    if (completedTask) {
                        eventBus.emit({
                            type: Events.BUILDING_COMPLETED,
                            entityId: id,
                            timestamp: Date.now(),
                            data: {
                                buildingType: completedTask.type,
                                status: 'SUCCESS'
                            }
                        });
                        
                        console.log(`[BUILD] Entity ${id} completed construction of: ${completedTask.type}`);
                    }
                }
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] BuildQueueSystem - Logistics Core OFFLINE.');
    }
}

export const buildQueueSystem = new BuildQueueSystem();
