/**
 * src/game/systems/MovementSystem.ts
 * Executor Cinematográfico (Domínio da Física).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from '../systemsRegistry';
 
export class MovementSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] MovementSystem - Cinematic Processor ONLINE.');
    }
 
    public preUpdate(deltaTime: number): void {}
 
    /**
     * Aplica translação física: Position += Velocity * deltaTime
     */
    public update(deltaTime: number): void {
        // Obter entidades com competência de movimento (Position + Velocity)
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
 
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');
 
            // Execução Cinematográfica Linear
            if (pos && vel) {
                pos.x += vel.dx * deltaTime;
                pos.y += vel.dy * deltaTime;
            }
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Cinematic Processor OFFLINE.');
    }
}
 
export const movementSystem = new MovementSystem();
