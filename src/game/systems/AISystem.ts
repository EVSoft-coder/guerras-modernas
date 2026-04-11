/**
 * src/game/systems/AISystem.ts
 * Automação e Pensamento Tático de Unidades.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
 
export class AISystem implements GameSystem {
    /**
     * Ciclo de vida: Inicialização de lógica cognitiva.
     */
    public init(): void {
        console.log('[SYSTEM] AISystem - Tactical Processors ACTIVE.');
    }
 
    /**
     * Ciclo de vida: Tomada de decisão em frações de segundo.
     */
    public update(deltaTime: number): void {
        // 1. Obter todas as entidades autónomas (AI + Velocity + Position)
        const drones = entityManager.getEntitiesWith(['AI', 'Velocity', 'Position']);
        
        // 2. Obter potenciais alvos (Health + Position)
        const targets = entityManager.getEntitiesWith(['Health', 'Position']);
 
        for (const droneId of drones) {
            const aiComp = entityManager.getComponent<any>(droneId, 'AI');
            const velComp = entityManager.getComponent<any>(droneId, 'Velocity');
            const posComp = entityManager.getComponent<any>(droneId, 'Position');
 
            if (aiComp.behavior === 'AGGRESSIVE') {
                this.pursueTarget(droneId, posComp, velComp, targets);
            } else if (aiComp.behavior === 'PATROL') {
                this.patrolZone(droneId, posComp, velComp);
            }
        }
    }
 
    /**
     * Comportamento: Perseguir o alvo mais próximo e ajustar vetor de velocidade.
     */
    private pursueTarget(droneId: number, pos: any, vel: any, targets: number[]): void {
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
 
        if (targetPos) {
            // Ajustar o vetor de velocidade em direção ao alvo (Unidirecional tática)
            const dx = targetPos.x - pos.x;
            const dy = targetPos.y - pos.y;
            const mag = Math.sqrt(dx * dx + dy * dy);
            
            if (mag > 0) {
                const speed = 40; // Pixels por segundo (Unidade base)
                vel.vx = (dx / mag) * speed;
                vel.vy = (dy / mag) * speed;
            }
        }
    }
 
    private patrolZone(droneId: number, pos: any, vel: any): void {
        // Lógica de ziguezague tático simples
        if (Math.random() < 0.05) {
            vel.vx = (Math.random() - 0.5) * 60;
            vel.vy = (Math.random() - 0.5) * 60;
        }
    }
 
    public destroy(): void {
        console.log('[SYSTEM] AISystem - Processors SUSPENDED.');
    }
}
 
export const aiSystem = new AISystem();
