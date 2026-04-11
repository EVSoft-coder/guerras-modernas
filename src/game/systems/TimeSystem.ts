import { System } from '../core/EntityManager';
import { EventBus } from '../core/EventBus';
import { Log } from '../utils/Logger';

export class TimeSystem implements System {
    private accumulator: number = 0;
    private readonly TICK_INTERVAL: number = 1.0; // 1 segundo

    init(): void {
        Log.info('[SYSTEM] TimeSystem - Global Clock ONLINE.');
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
        EventBus.emit({
            type: 'GAME:TICK',
            timestamp: Date.now(),
            data: { deltaTime: this.TICK_INTERVAL }
        });
    }

    postUpdate(dt: number): void {}

    destroy(): void {
        Log.info('[SYSTEM] TimeSystem - Global Clock OFFLINE.');
    }
}
