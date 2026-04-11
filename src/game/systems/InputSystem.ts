import { System } from '../core/EntityManager';
import { EventBus, Events } from '../core/EventBus';
import { Log } from '../utils/Logger';

export class InputSystem implements System {
    private keys: { [key: string]: boolean } = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    init(): void {
        Log.info('[SYSTEM] InputSystem - Continuous Sensors ONLINE.');
        window.addEventListener('keydown', (e) => this.updateKeyState(e.code, true));
        window.addEventListener('keyup', (e) => this.updateKeyState(e.code, false));
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
        EventBus.emit({
            type: 'PLAYER:INPUT_STATE',
            timestamp: Date.now(),
            data: { ...this.keys }
        });
    }

    postUpdate(dt: number): void {}

    destroy(): void {
        Log.info('[SYSTEM] InputSystem - Continuous Sensors OFFLINE.');
    }
}
