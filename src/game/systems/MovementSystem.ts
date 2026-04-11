/**
 * MovementSystem.ts
 * Processamento de Manobras de Campo.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
 
export class MovementSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] MovementSystem - Engines online.');
    }
 
    public update(deltaTime: number): void {
        // Obter todas as entidades com capacidades de manobra (Position + Velocity)
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
        
        let processedCount = 0;
 
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');
 
            if (pos && vel) {
                pos.x += vel.vx * deltaTime;
                pos.y += vel.vy * deltaTime;
                processedCount++;
            }
        }
 
        if (processedCount > 0) {
            console.log(`[SYSTEM] MovementSystem processed ${processedCount} entities.`);
        }
    }
 
    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Engines offline.');
    }
}
 
export const movementSystem = new MovementSystem();
