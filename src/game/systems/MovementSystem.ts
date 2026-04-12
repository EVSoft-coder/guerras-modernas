/**
 * src/game/systems/MovementSystem.ts
 * Executor CinematogrÃ¡fico com Resposta a Comandos (Doutrina Literal).
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, EventPayload } from '../../core/EventBus';
import { GameSystem } from './types';
import { Pathfinding } from '../../utils/Pathfinding';
 
export class MovementSystem implements GameSystem {
    private speed: number = 3.0; // Velocidade tÃ¡ctica

    public init(): void {
        console.log('[SYSTEM] MovementSystem - Tactical Navigation (A*) ONLINE.');
        
        // Subscrever à ordem de deslocamento tático
        eventBus.subscribe('UNIT:MOVE', (payload: EventPayload) => {
            this.handleMoveOrder(payload.data);
        });
    }

    private handleMoveOrder(data: any): void {
        const { targetX, targetY } = data;
        // Obter entidade sob selecção
        const selectedEntities = entityManager.getEntitiesWith(['Selection', 'GridPosition', 'Velocity']);
        
        selectedEntities.forEach(id => {
            const pos = entityManager.getComponent<any>(id, 'GridPosition');
            const vel = entityManager.getComponent<any>(id, 'Velocity');
            
            if (pos && vel) {
                // Calcular caminho usando A*
                const path = Pathfinding.findPath(
                    { x: pos.x, y: pos.y },
                    { x: targetX, y: targetY },
                    (x, y) => this.isWalkable(x, y)
                );

                if (path && path.length > 0) {
                    vel.path = path;
                    vel.isMoving = true;
                    console.log(`Unit ${id} path calculated: ${path.length} waypoints.`);
                } else {
                    console.warn(`Unit ${id} could not find path to ${targetX}:${targetY}`);
                }
            }
        });
    }

    private isWalkable(x: number, y: number): boolean {
        // LÃ³gica de ColisÃ£o GeogrÃ¡fica (Exemplo: evitar edifÃ­cios/vilas densas)
        // Por agora, permitimos tudo o que nÃ£o for o limite do mundo (0-1000)
        return x >= 0 && x < 1000 && y >= 0 && y < 1000;
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        const entities = entityManager.getEntitiesWith(['GridPosition', 'Velocity']);

        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'GridPosition');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');

            if (pos && vel && vel.isMoving && vel.path && vel.path.length > 0) {
                const nextPoint = vel.path[0];
                const dx = nextPoint.x - pos.x;
                const dy = nextPoint.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 0.1) {
                    // Ponto alcanÃ§ado, remover da fila e passar para o prÃ³ximo
                    pos.x = nextPoint.x;
                    pos.y = nextPoint.y;
                    vel.path.shift();

                    if (vel.path.length === 0) {
                        vel.isMoving = false;
                        vel.vx = 0;
                        vel.vy = 0;
                        console.log(`Unit ${entityId} reached final objective.`);
                    }
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
