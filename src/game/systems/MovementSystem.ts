/**
 * src/game/systems/MovementSystem.ts
 * Executor Cinematográfico com Resposta a Comandos (Doutrina Literal).
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, EventPayload } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class MovementSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] MovementSystem - Cinematic Processor ONLINE.');
        
        eventBus.subscribe('PLAYER:MOVE', (payload: EventPayload) => {
            this.handlePlayerMove(payload.data.direction);
        });
    }
 
    private handlePlayerMove(direction: string): void {
        const entities = entityManager.getEntitiesWith(['Position', 'Velocity']);
        
        for (const id of entities) {
            const isAI = entityManager.getComponent<any>(id, 'AI');
            if (isAI) continue;
 
            const vel = entityManager.getComponent<any>(id, 'Velocity');
 
            // Atribuição Literal conforme exemplo do Comandante
            switch (direction) {
                case 'UP':    vel.dy = -1; vel.dx = 0; break;
                case 'DOWN':  vel.dy = 1;  vel.dx = 0; break;
                case 'LEFT':  vel.dx = -1; vel.dy = 0; break;
                case 'RIGHT': vel.dx = 1;  vel.dy = 0; break;
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
                pos.x += vel.dx * deltaTime;
                pos.y += vel.dy * deltaTime;
                
                // Telemetria de Posição (Alpha-Zero & Outros)
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
