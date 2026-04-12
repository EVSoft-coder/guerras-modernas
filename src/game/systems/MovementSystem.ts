/**
 * src/game/systems/MovementSystem.ts
 * Executor CinematogrÃ¡fico com Resposta a Comandos (Doutrina Literal).
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, EventPayload } from '../../core/EventBus';
import { GameSystem } from './types';
 
export class MovementSystem implements GameSystem {
    private speed: number = 2.0; // Células por segundo

    public init(): void {
        console.log('[SYSTEM] MovementSystem - Tactical Navigation ONLINE.');
        
        // Subscrever à ordem de deslocamento tático
        eventBus.subscribe('UNIT:MOVE', (payload: EventPayload) => {
            console.log("MOVEMENT ORDER RECEIVED:", payload.data);
            this.handleMoveOrder(payload.data);
        });
    }

    private handleMoveOrder(data: any): void {
        const { targetX, targetY } = data;
        // Obter entidade sob selecção
        const selectedEntities = entityManager.getEntitiesWith(['Selection', 'GridPosition', 'Velocity']);
        
        selectedEntities.forEach(id => {
            const vel = entityManager.getComponent<any>(id, 'Velocity');
            if (vel) {
                vel.targetX = targetX;
                vel.targetY = targetY;
                vel.isMoving = true;
                console.log(`Unit ${id} marching to sector ${targetX}:${targetY}`);
            }
        });
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        const entities = entityManager.getEntitiesWith(['GridPosition', 'Velocity']);

        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'GridPosition');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');

            if (pos && vel && vel.isMoving) {
                const dx = vel.targetX - pos.x;
                const dy = vel.targetY - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 0.05) {
                    pos.x = vel.targetX;
                    pos.y = vel.targetY;
                    vel.isMoving = false;
                    vel.vx = 0;
                    vel.vy = 0;
                    console.log(`Unit ${entityId} reached objective.`);
                } else {
                    // Mover gradualmente (NÃO TELEPORTAR)
                    const vx = (dx / distance) * this.speed;
                    const vy = (dy / distance) * this.speed;
                    
                    pos.x += vx * deltaTime;
                    pos.y += vy * deltaTime;
                    
                    vel.vx = vx; // Para efeitos visuais/rastreamento
                    vel.vy = vy;
                }
            }
        }
    }

    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Tactical Navigation OFFLINE.');
    }
}
 
export const movementSystem = new MovementSystem();
