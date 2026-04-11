/**
 * src/game/systems/MovementSystem.ts
 * Sistema de processamento de manobras físicas.
 */
import { entityManager } from '../entities/EntityManager';
 
export class MovementSystem {
    /**
     * Atualiza a posição de todas as entidades com velocidade.
     */
    public update(deltaTime: number): void {
        const entities = entityManager.getAllEntities();
 
        for (const entityId of entities) {
            const pos = entityManager.positions.get(entityId);
            const vel = entityManager.velocities.get(entityId);
 
            // Regra: Apenas Entities com Position + Velocity são atualizadas
            if (pos && vel) {
                pos.x += vel.vx * deltaTime;
                pos.y += vel.vy * deltaTime;
            }
        }
    }
}
 
export const movementSystem = new MovementSystem();
