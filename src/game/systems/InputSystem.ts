/**
 * src/game/systems/InputSystem.ts
 * Sensores de Entrada com Sinalização Normalizada.
 */
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class InputSystem implements GameSystem {
    private keysPressed: Set<string> = new Set();
 
    public init(): void {
        console.log('[SYSTEM] InputSystem - Online.');
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        // Telemetria básica
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        console.log('[SYSTEM] InputSystem - Offline.');
    }
 
    private handleKeyDown(e: KeyboardEvent): void {
        if (!this.keysPressed.has(e.code)) {
            this.keysPressed.add(e.code);
            eventBus.emit({
                type: Events.INPUT_KEY_DOWN,
                timestamp: Date.now(),
                data: { key: e.code }
            });
        }
    }
 
    private handleKeyUp(e: KeyboardEvent): void {
        this.keysPressed.delete(e.code);
        eventBus.emit({
            type: Events.INPUT_KEY_UP,
            timestamp: Date.now(),
            data: { key: e.code }
        });
    }
 
    public isKeyPressed(code: string): boolean {
        return this.keysPressed.has(code);
    }
}
 
export const inputSystem = new InputSystem();
