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
        const entities = entityManager.getEntitiesWith(['Resource']);
 
        for (const id of entities) {
            const res = entityManager.getComponent<any>(id, 'Resource');
            if (res) {
                res.wood += 1;
                res.stone += 1;
                res.iron += 1;
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
鼓
鼓
鼓
