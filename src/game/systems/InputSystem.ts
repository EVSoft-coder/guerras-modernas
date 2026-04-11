/**
 * src/game/systems/InputSystem.ts
 * Sensor de Estado de Comando Contínuo.
 */
import { eventBus } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class InputSystem implements GameSystem {
    private keys: Record<string, boolean> = {
        up: false,
        down: false,
        left: false,
        right: false
    };
 
    public init(): void {
        console.log('[SYSTEM] InputSystem - Continuous Sensors ONLINE.');
        
        window.addEventListener('keydown', (e) => this.updateKeyState(e.code, true));
        window.addEventListener('keyup', (e) => this.updateKeyState(e.code, false));
    }
 
    private updateKeyState(code: string, isPressed: boolean): void {
        switch (code) {
            case 'KeyW': case 'ArrowUp':    this.keys.up = isPressed; break;
            case 'KeyS': case 'ArrowDown':  this.keys.down = isPressed; break;
            case 'KeyA': case 'ArrowLeft':  this.keys.left = isPressed; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = isPressed; break;
        }
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        // Emitir estado actual para o barramento a cada frame
        eventBus.emit({
            type: 'PLAYER:INPUT_STATE',
            timestamp: Date.now(),
            data: { ...this.keys }
        });
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] InputSystem - Continuous Sensors OFFLINE.');
    }
}
 
export const inputSystem = new InputSystem();
鼓
鼓
