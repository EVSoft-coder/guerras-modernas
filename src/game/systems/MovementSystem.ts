/**
 * src/game/systems/MovementSystem.ts
 * Domínio de Navegação e Física.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
 
export class MovementSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] MovementSystem - Navigation Online.');
    }
 
    public update(deltaTime: number): void {
        // Unidades com capacidade de movimento
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
        
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');
            const target = entityManager.getComponent<any>(entityId, 'Target');
 
            // 1. Resolver Navegação (Target -> Velocity)
            if (target) {
                const dx = target.x - pos.x;
                const dy = target.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
 
                if (distance > 5) {
                    const speed = 100;
                    vel.vx = (dx / distance) * speed;
                    vel.vy = (dy / distance) * speed;
                } else {
                    // Alvo alcançado: Estabilizar
                    vel.vx = 0;
                    vel.vy = 0;
                    entityManager.removeComponent(entityId, 'Target');
                }
            }
 
            // 2. Aplicar Física (Velocity -> Position)
            if (vel.vx !== 0 || vel.vy !== 0) {
                pos.x += vel.vx * deltaTime;
                pos.y += vel.vy * deltaTime;
            }
        }
    }
 
    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Navigation Offline.');
    }
}
 
export const movementSystem = new MovementSystem();
