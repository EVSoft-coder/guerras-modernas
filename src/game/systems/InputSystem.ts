/**
 * InputSystem.ts
 * Captura de Entradas e Disparo de Eventos.
 */
import { eventBus } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class InputSystem implements GameSystem {
    private keysPressed: Set<string> = new Set();
 
    public init(): void {
        console.log('[SYSTEM] InputSystem - Sensors online.');
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }
 
    public update(deltaTime: number): void {
        // Log básico de telemetria
        if (this.keysPressed.size > 0) {
            console.log(`[SYSTEM] InputSystem update - Active keys: ${Array.from(this.keysPressed).join(', ')}`);
        }
    }
 
    public destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        console.log('[SYSTEM] InputSystem - Sensors offline.');
    }
 
    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.keysPressed.has(e.code)) {
            this.keysPressed.add(e.code);
            eventBus.emit({
                type: 'KEY_DOWN',
                timestamp: Date.now(),
                data: { key: e.code }
            });
        }
    };
 
    private handleKeyUp = (e: KeyboardEvent) => {
        this.keysPressed.delete(e.code);
        eventBus.emit({
            type: 'KEY_UP',
            timestamp: Date.now(),
            data: { key: e.code }
        });
    };
 
    public isKeyPressed(code: string): boolean {
        return this.keysPressed.has(code);
    }
}
 
export const inputSystem = new InputSystem();
