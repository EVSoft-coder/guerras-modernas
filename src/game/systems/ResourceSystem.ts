/**
 * src/game/systems/ResourceSystem.ts
 * Motor de Produção Logística (Economia Passiva).
 */
import { eventBus, EventPayload } from '../../core/EventBus';
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';

// Mock ou Fallback para buildingEffects se não existir
const buildingEffects: Record<string, any> = {
    'mina_suprimentos': { resource: 'wood', baseProduction: 10 },
    'refinaria': { resource: 'iron', baseProduction: 5 },
    'fabrica_municoes': { resource: 'stone', baseProduction: 5 }
};

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
                const config = buildingEffects[building.type];
                if (!config) continue;

                const multiplier = building.level || 1;
                const totalProduction = config.baseProduction * multiplier;

                if (config.resource === 'all') {
                    res.wood += totalProduction;
                    res.stone += totalProduction;
                    res.iron += totalProduction;
                } else {
                    res[config.resource] += totalProduction;
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
