/**
 * src/game/systems/AISystem.ts
 * Decisão Autónoma (Domínio de Intenção).
 */
import { entityManager } from '../../core/EntityManager';
import { TargetComponent } from '../components/BaseComponents';
import { GameSystem } from '../systemsRegistry';
 
export class AISystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AISystem - Decision Engine ACTIVE.');
    }
 
    public update(deltaTime: number): void {
        const drones = entityManager.getEntitiesWith(['AI', 'Position']);
        const targets = entityManager.getEntitiesWith(['Health', 'Position']);
 
        for (const droneId of drones) {
            // SOBERANIA DE COMANDO: Se já houver um alvo (ordem do jogador), a IA espera.
            if (entityManager.getComponent<any>(droneId, 'Target')) continue;
 
            const aiComp = entityManager.getComponent<any>(droneId, 'AI');
            const posComp = entityManager.getComponent<any>(droneId, 'Position');
 
            if (aiComp.behavior === 'AGGRESSIVE') {
                this.pursueTarget(droneId, posComp, targets);
            }
        }
    }
 
    /**
     * Define a intenção de movimento (Target), não a velocidade direta.
     */
    private pursueTarget(droneId: number, pos: any, targets: number[]): void {
        let nearestDist = Infinity;
        let targetPos: any = null;
 
        for (const targetId of targets) {
            if (targetId === droneId) continue;
 
            const tPos = entityManager.getComponent<any>(targetId, 'Position');
            const dist = Math.sqrt(Math.pow(tPos.x - pos.x, 2) + Math.pow(tPos.y - pos.y, 2));
 
            if (dist < nearestDist) {
                nearestDist = dist;
                targetPos = tPos;
            }
        }
 
        if (targetPos && nearestDist > 20) {
            // IA escreve apenas no seu domínio: Intenção de Alvo
            entityManager.addComponent(droneId, new TargetComponent(targetPos.x, targetPos.y));
        }
    }
 
    public destroy(): void {
        console.log('[SYSTEM] AISystem - Decision Engine SUSPENDED.');
    }
}
 
export const aiSystem = new AISystem();
