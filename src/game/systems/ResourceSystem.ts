/**
 * src/game/systems/ResourceSystem.ts
 * Motor de ProduÃ§Ã£o LogÃ­stica (Economia em Tempo Real).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';

export class ResourceSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] ResourceSystem - Economic Core ONLINE.');
    }

    public update(deltaTime: number): void {
        this.processProduction(deltaTime);
    }

    private processProduction(deltaTime: number): void {
        const entities = entityManager.getEntitiesWith(['Resource', 'Production']);

        for (const id of entities) {
            const res = entityManager.getComponent<any>(id, 'Resource');
            const prod = entityManager.getComponent<any>(id, 'Production');

            if (res && prod) {
                const amount = prod.ratePerSecond * deltaTime;
                
                if (prod.resourceType === 'all') {
                    res.wood = Math.min(res.cap, res.wood + amount);
                    res.stone = Math.min(res.cap, res.stone + amount);
                    res.iron = Math.min(res.cap, res.iron + amount);
                } else {
                    const type = prod.resourceType;
                    res[type] = Math.min(res.cap, res[type] + amount);
                }
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] ResourceSystem - Economic Core OFFLINE.');
    }
}

export const resourceSystem = new ResourceSystem();
