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

    /**
     * Calcula o tempo tático de marcha baseado em distância física e velocidade operacional.
     */
    public calculateMarchTime(origin: {x: number, y: number}, target: {x: number, y: number}, unitSpeed?: number): number {
        const dx = target.x - origin.x;
        const dy = target.y - origin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const calcSpeed = unitSpeed || this.speed;
        return (distance / calcSpeed) * 10; // Fator de escala tático
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

        // 1. Processar Movimento Base (A*)
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'GridPosition');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');

            if (pos && vel && vel.isMoving && vel.path && vel.path.length > 0) {
                const nextPoint = vel.path[0];
                
                if (!nextPoint || nextPoint.x === undefined || nextPoint.y === undefined) {
                    vel.path.shift();
                    if (vel.path.length === 0) vel.isMoving = false;
                    continue;
                }

                const dx = nextPoint.x - pos.x;
                const dy = nextPoint.y - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 0.1) {
                    pos.x = nextPoint.x;
                    pos.y = nextPoint.y;
                    vel.path.shift();

                    if (vel.path.length === 0) {
                        vel.isMoving = false;
                        vel.vx = 0;
                        vel.vy = 0;
                    }
                } else {
                    const unit = entityManager.getComponent<any>(entityId, 'Unit');
                    const baseSpeed = unit?.speed || this.speed;
                    const speedBonus = unit?.speedBonus || 1.0;
                    const currentSpeed = baseSpeed * speedBonus;

                    const vx = (dx / distance) * currentSpeed;
                    const vy = (dy / distance) * currentSpeed;
                    
                    pos.x += vx * deltaTime;
                    pos.y += vy * deltaTime;
                    
                    vel.vx = vx;
                    vel.vy = vy;
                }
            }
        }

        // 2. Processar Movimento de Marchas (Interpolação Temporal)
        const marchEntities = entityManager.getEntitiesWith(['March', 'GridPosition']);
        const now = Date.now();

        for (const mId of marchEntities) {
            const march = entityManager.getComponent<any>(mId, 'March');
            const pos = entityManager.getComponent<any>(mId, 'GridPosition');

            if (march && pos && march.status !== 'completed') {
                if (march.status === "going") {
                    const duration = march.arrivalTime - march.startTime;
                    if (duration > 0) {
                        const progress = Math.min(1, Math.max(0, (now - march.startTime) / duration));
                        pos.x = march.originX + (march.targetX - march.originX) * progress;
                        pos.y = march.originY + (march.targetY - march.originY) * progress;
                    }
                } else if (march.status === "returning") {
                    const duration = march.returnTime - march.arrivalTime;
                    if (duration > 0) {
                        const progress = Math.min(1, Math.max(0, (now - march.arrivalTime) / duration));
                        pos.x = march.targetX + (march.originX - march.targetX) * progress;
                        pos.y = march.targetY + (march.originY - march.targetY) * progress;
                    }
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
