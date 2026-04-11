/**
 * src/game/systems/InputSystem.ts
 * Tradução de Sensores em Intenções Tácticas (PLAYER events).
 */
import { eventBus } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class InputSystem implements GameSystem {
    private keyMap: Record<string, string> = {
        'KeyW': 'UP',
        'KeyS': 'DOWN',
        'KeyA': 'LEFT',
        'KeyD': 'RIGHT',
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT'
    };
 
    public init(): void {
        console.log('[SYSTEM] InputSystem - Peripheral Uplink ACTIVE.');
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        // Lógica de pooling se necessário futuramente
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        console.log('[SYSTEM] InputSystem - Peripheral Downlink Offline.');
    }
 
    private handleKeyDown(e: KeyboardEvent): void {
        const direction = this.keyMap[e.code];
        
        if (direction) {
            // Emissão de Intenção Táctica Normalizada
            eventBus.emit({
                type: 'PLAYER:MOVE',
                timestamp: Date.now(),
                data: { direction }
            });
        }
    }
}
 
export const inputSystem = new InputSystem();
