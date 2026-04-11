/**
 * src/game/systems/BuildQueueSystem.ts
 * Gestão de Prioridades e Cronogramas de Construção.
 */
import { eventBus, EventPayload, Events } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';

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
