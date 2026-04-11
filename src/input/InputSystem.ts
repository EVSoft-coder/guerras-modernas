/**
 * src/input/InputSystem.ts
 * Captura de entradas e emissão de eventos táticos.
 */
import { eventBus } from '../core/EventBus';
 
class InputSystem {
    private keysPressed: Set<string> = new Set();
 
    /**
     * Inicializa os sensores de entrada.
     */
    public initialize(): void {
        window.addEventListener('keydown', (e) => {
            if (!this.keysPressed.has(e.code)) {
                this.keysPressed.add(e.code);
                eventBus.emit('KEY_DOWN', { key: e.code });
            }
        });
 
        window.addEventListener('keyup', (e) => {
            this.keysPressed.delete(e.code);
            eventBus.emit('KEY_UP', { key: e.code });
        });
 
        console.log('[INPUT] Sensors active.');
    }
 
    /**
     * Verifica se uma tecla específica está pressionada.
     */
    public isKeyPressed(code: string): boolean {
        return this.keysPressed.has(code);
    }
}
 
export const inputSystem = new InputSystem();
