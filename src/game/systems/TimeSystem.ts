import { GameSystem } from './types';
import { eventBus } from '@src/core/EventBus';
import { Logger } from '@src/core/Logger';

export class TimeSystem implements GameSystem {
    private accumulator: number = 0;
    private readonly TICK_INTERVAL: number = 1.0; // 1 segundo

    init(): void {
        console.log('[SYSTEM] TimeSystem - Global Clock ONLINE.');
    }

    preUpdate(dt: number): void {}

    update(dt: number): void {
        this.accumulator += dt;
        if (this.accumulator >= this.TICK_INTERVAL) {
            this.emitTick();
            this.accumulator -= this.TICK_INTERVAL;
        }
    }

    private emitTick(): void {
        eventBus.emit({
            type: 'GAME:TICK',
            timestamp: Date.now(),
            data: { deltaTime: this.TICK_INTERVAL }
        });
    }

    postUpdate(dt: number): void {}

    destroy(): void {
        console.log('[SYSTEM] TimeSystem - Global Clock OFFLINE.');
    }
}

export const timeSystem = new TimeSystem();
