import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';

export class ResourceSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] ResourceSystem - Logistics and Upkeep Engine ACTIVE.');
    }

    public update(deltaTime: number): void {
        this.processLogistics(deltaTime);
    }

    private processLogistics(deltaTime: number): void {
        // [AUDIT] Client-side resource authority REMOVED.
        // As defined in the Atomic Resource Engine migration, all resource calculations 
        // are now performed exclusively on the server side (Laravel).
        // The ECS Resource components should only be updated via backend sync events.
        // No Delta-Time based increments (+rate * dt) are allowed here.
    }

    public sync(resources: any): void {
        if (!resources) return;
        
        // Sincronizar Entidade 1 (Base Principal do Jogador no ECS)
        const baseEntity = 1;
        if (entityManager.hasEntity(baseEntity)) {
            const resComp = entityManager.getComponent<any>(baseEntity, 'Resource');
            if (resComp) {
                resComp.suprimentos = Number(resources.suprimentos);
                resComp.combustivel = Number(resources.combustivel);
                resComp.municoes = Number(resources.municoes);
                resComp.metal = Number(resources.metal);
                resComp.pessoal = Number(resources.pessoal);
                resComp.energia = Number(resources.energia);
                console.log('[ECS] ResourceSystem - Synchronized via Backend Uplink.');
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}

export const resourceSystem = new ResourceSystem();
