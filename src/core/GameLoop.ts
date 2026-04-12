/**
 * GameLoop.ts
 * Marcapasso nuclear do motor ECS.
 */
import { systemsRegistry } from '../game/systems/systemsRegistry';
import { Logger } from './Logger';
 
class GameLoop {
    private lastTime: number = 0;
    private running: boolean = false;
    private frameId: number | null = null;
 
    /**
     * Inicia a sequência de ignição do motor.
     */
    public start(): void {
        if (this.running) return;
        this.running = true;
        
        Logger.info('[ENGINE] GameLoop starting sequence...');
        
        // Inicialização de todos os sistemas registados
        systemsRegistry.forEach(system => {
            try {
                system.init();
            } catch (e) {
                console.error(`[CRITICAL_FAILURE] System init error:`, system, e);
            }
        });
 
        this.lastTime = performance.now();
        this.frameId = requestAnimationFrame(this.loop.bind(this));
    }
 
    /**
     * Ciclo principal de atualização (Tick).
     */
    private loop(currentTime: number): void {
        if (!this.running) return;

        const deltaTimeMillis = currentTime - this.lastTime;
        
        // Barreira Táctica: Limitar a ~60 FPS para estabilidade de física e lógica
        if (deltaTimeMillis < 16) {
            this.frameId = requestAnimationFrame(this.loop.bind(this));
            return;
        }

        const deltaTime = deltaTimeMillis / 1000;
        this.lastTime = currentTime;
 
        // Orquestração de fases táticas com isolamento de falhas
        systemsRegistry.forEach(s => {
            try { s.preUpdate(deltaTime); } 
            catch (e) { console.error(`[GAMELOOP_ERROR] preUpdate failure: ${s.constructor.name}`, e); }
        });

        systemsRegistry.forEach(s => {
            try { s.update(deltaTime); } 
            catch (e) { console.error(`[GAMELOOP_ERROR] update failure: ${s.constructor.name}`, e); }
        });

        systemsRegistry.forEach(s => {
            try { s.postUpdate(deltaTime); } 
            catch (e) { console.error(`[GAMELOOP_ERROR] postUpdate failure: ${s.constructor.name}`, e); }
        });
 
        this.frameId = requestAnimationFrame(this.loop.bind(this));
    }
 
    /**
     * Paragem de emergência do motor.
     */
    public stop(): void {
        this.running = false;
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
        }
        
        // Destruição controlada dos sistemas
        systemsRegistry.forEach(system => system.destroy());
        Logger.info('[ENGINE] GameLoop halted.');
    }
}
 
export const gameLoop = new GameLoop();
