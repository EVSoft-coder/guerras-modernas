/**
 * src/game/systems/AISystem.ts
 * DecisÃ£o AutÃ³noma (DomÃ­nio de IntenÃ§Ã£o).
 */
import { entityManager } from '../../core/EntityManager';
import { TargetComponent } from '../components/BaseComponents';
import { GameSystem } from './types';
 
export class AISystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AISystem - Decision Engine ACTIVE.');
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        const drones = entityManager.getEntitiesWith(['AI', 'GridPosition']);
        const targets = entityManager.getEntitiesWith(['Health', 'GridPosition']);
 
        for (const droneId of drones) {
            if (entityManager.getComponent<any>(droneId, 'Target')) continue;
 
            const aiComp = entityManager.getComponent<any>(droneId, 'AI');
            const posComp = entityManager.getComponent<any>(droneId, 'GridPosition');
 
            if (aiComp.behavior === 'AGGRESSIVE') {
                this.pursueTarget(droneId, posComp, targets);
            }
        }
    }
 
    private pursueTarget(droneId: number, pos: any, targets: number[]): void {
        let nearestDist = Infinity;
        let targetPos: any = null;
 
        for (const targetId of targets) {
            if (targetId === droneId) continue;
            const tPos = entityManager.getComponent<any>(targetId, 'GridPosition');
            if (!tPos || !pos) continue;

            const dist = Math.sqrt(Math.pow(tPos.x - pos.x, 2) + Math.pow(tPos.y - pos.y, 2));
 
            if (dist < nearestDist) {
                nearestDist = dist;
                targetPos = tPos;
            }
        }
 
        if (targetPos && nearestDist > 20 && pos) {
            entityManager.addComponent(droneId, new TargetComponent(targetPos.x, targetPos.y));
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] AISystem - Decision Engine SUSPENDED.');
    }
}
 
export const aiSystem = new AISystem();
