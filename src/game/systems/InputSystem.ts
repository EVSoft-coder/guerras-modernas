import { GameSystem } from './types';
import { eventBus, Events } from '../../core/EventBus';

export class InputSystem implements GameSystem {
    private keys: { [key: string]: boolean } = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    init(): void {
        console.log('[SYSTEM] InputSystem - Continuous Sensors ONLINE.');
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private handleKeyDown(e: KeyboardEvent): void {
        this.updateKeyState(e.code, true);
        eventBus.emit({
            type: Events.INPUT_KEY_DOWN,
            timestamp: Date.now(),
            data: { code: e.code }
        });
    }

    private handleKeyUp(e: KeyboardEvent): void {
        this.updateKeyState(e.code, false);
        eventBus.emit({
            type: Events.INPUT_KEY_UP,
            timestamp: Date.now(),
            data: { code: e.code }
        });
    }

    private updateKeyState(code: string, isDown: boolean): void {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.up = isDown;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.keys.down = isDown;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = isDown;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = isDown;
                break;
        }
    }

    preUpdate(dt: number): void {}

    update(dt: number): void {
        // Broadcast do estado contínuo para sistemas de movimento
        eventBus.emit({
            type: 'PLAYER:INPUT_STATE',
            timestamp: Date.now(),
            data: { ...this.keys }
        });
    }

    postUpdate(dt: number): void {}

    destroy(): void {
        console.log('[SYSTEM] InputSystem - Continuous Sensors OFFLINE.');
    }
}

export const inputSystem = new InputSystem();
