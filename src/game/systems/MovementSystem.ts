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
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
        
        let processedCount = 0;
 
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');
            const target = entityManager.getComponent<any>(entityId, 'Target');
 
            // 1. Processar Navegação de Alvo se existir
            if (target) {
                const dx = target.x - pos.x;
                const dy = target.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
 
                if (distance > 5) { // Threshold de chegada
                    const speed = 100; // Velocidade de marcha
                    vel.vx = (dx / distance) * speed;
                    vel.vy = (dy / distance) * speed;
                } else {
                    // Alvo atingido: Parar e remover alvo
                    vel.vx = 0;
                    vel.vy = 0;
                    entityManager.removeComponent(entityId, 'Target');
                }
            }
 
            // 2. Aplicar Manobra Física
            if (pos && vel) {
                pos.x += vel.vx * deltaTime;
                pos.y += vel.vy * deltaTime;
                processedCount++;
            }
        }
 
        if (processedCount > 0) {
            // console.log(`[SYSTEM] MovementSystem processed ${processedCount} entities.`);
        }
    }
 
    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Engines offline.');
    }
}
 
export const movementSystem = new MovementSystem();
