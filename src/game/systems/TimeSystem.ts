/**
 * src/game/systems/TimeSystem.ts
 * Cronómetro Mestre e Emissor de Pulsação Táctica.
 */
import { eventBus } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class TimeSystem implements GameSystem {
    private accumulator: number = 0;
    private readonly TICK_INTERVAL: number = 1.0; // 1 segundo
 
    public init(): void {
        console.log('[SYSTEM] TimeSystem - Global Clock ONLINE.');
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        this.accumulator += deltaTime;
 
        if (this.accumulator >= this.TICK_INTERVAL) {
            this.emitTick();
            this.accumulator -= this.TICK_INTERVAL;
        }
    }
 
    private emitTick(): void {
        eventBus.emit({
            type: 'GAME:TICK',
            timestamp: Date.now(),
            data: { 
                deltaTime: this.TICK_INTERVAL 
            }
        });
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] TimeSystem - Global Clock OFFLINE.');
    }
}
 
export const timeSystem = new TimeSystem();
鼓
鼓
鼓
