/**
 * src/game/systems/MovementSystem.ts
 * Executor CinematogrÃ¡fico com Resposta a Comandos (Doutrina Literal).
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, EventPayload } from '../../core/EventBus';
import { GameSystem } from './types';
 
export class MovementSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] MovementSystem - Cinematic Processor ONLINE.');
        
        // Subscrever ao estado contÃ­nuo de input
        eventBus.subscribe('PLAYER:INPUT_STATE', (payload: EventPayload) => {
            this.handleInputState(payload.data);
        });
    }
 
    private handleInputState(state: any): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity', 'Player']);
        
        for (const id of entities) {
            const vel = entityManager.getComponent<any>(id, 'Velocity');
            if (!vel) continue;
 
            // Reset de velocidade para cálculo fresco
            vel.vx = 0;
            vel.vy = 0;
 
            if (state.up)    vel.vy -= 1;
            if (state.down)  vel.vy += 1;
            if (state.left)  vel.vx -= 1;
            if (state.right) vel.vx += 1;
 
            // NormalizaÃ§Ã£o: Evitar que diagonal seja mais rÃ¡pida (sqrt(2))
            const length = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);
            if (length > 0) {
                vel.vx /= length;
                vel.vy /= length;
            }
        }
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
 
        for (const entityId of entities) {
            const pos = entityManager.getComponent<any>(entityId, 'Position');
            const vel = entityManager.getComponent<any>(entityId, 'Velocity');
 
            if (pos && vel) {
                pos.x += vel.vx * deltaTime;
                pos.y += vel.vy * deltaTime;
                
                // Telemetria de PosiÃ§Ã£o (Alpha-Zero & Outros)
                console.log(`[TELEMETRY] Entity ${entityId} at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            }
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] MovementSystem - Cinematic Processor OFFLINE.');
    }
}
 
export const movementSystem = new MovementSystem();
