/**
 * src/game/systems/ResourceSystem.ts
 * Motor de Produção Logística (Economia Passiva).
 */
import { eventBus, EventPayload } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';

export class ResourceSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] ResourceSystem - Economic Core ONLINE.');
        
        // Subscrever à pulsação do tempo
        eventBus.subscribe('GAME:TICK', (payload: EventPayload) => {
            this.generateResources();
        });
    }

    private generateResources(): void {
        const entities = entityManager.getEntitiesWith(['Resource', 'Building']);

        for (const id of entities) {
            const res = entityManager.getComponent<any>(id, 'Resource');
            const building = entityManager.getComponent<any>(id, 'Building');

            if (res && building) {
                const amount = building.level || 1;

                switch (building.type) {
                    case 'MINE':
                        res.iron += amount;
                        res.stone += Math.floor(amount / 2) || 1;
                        break;
                    case 'SAWMILL':
                        res.wood += amount;
                        break;
                    case 'HQ':
                        res.wood += amount;
                        res.stone += amount;
                        res.iron += amount;
                        break;
                    default:
                        // Produção base se o edifício for reconhecido mas genérico
                        res.wood += 1;
                        res.stone += 1;
                        res.iron += 1;
                        break;
                }
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] ResourceSystem - Economic Core OFFLINE.');
    }
}

export const resourceSystem = new ResourceSystem();
