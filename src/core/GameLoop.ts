import { stateManager } from './StateManager';
import { systemsRegistry } from '../game/systems/systemsRegistry';
import { Logger } from './Logger';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
    private initialized: boolean = false;
    private animationFrameId: number | null = null; // Ciclo Assíncrono (Browser-safe)
 
    public init(): void {
        if (this.initialized) return;
        
        console.log("GAMELOOP INIT");
        
        Logger.info('Starting Tactical Initialization...');
        for (const system of systemsRegistry) {
            system.init();
        }
        this.initialized = true;
        this.lastTime = performance.now();
        Logger.info('Initialization Complete.');
    }
 
    public run(): void {
        if (!this.initialized) this.init();
        if (this.gameRunning) return;
        this.gameRunning = true;
        Logger.info('Mission Active. Pipeline: PRE -> UPDATE -> POST');
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
 
    public shutdown(): void {
        this.gameRunning = false;
        if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
        for (const system of systemsRegistry) {
            system.destroy();
        }
        Logger.info('System Shutdown. All stations offline.');
    }
 
    private loop(currentTime: number): void {
        if (!this.gameRunning) return;
        console.log("GAMELOOP RUNNING");
 
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        const dt = Math.min(deltaTime, 0.1);
 
        /**
         * FASE I: PRE_UPDATE (Preparação Global)
         */
        for (const system of systemsRegistry) {
            system.preUpdate(dt);
        }
 
        /**
         * FASE II: UPDATE (Pipeline Táctico Rígido)
         */
         
        // 1. [INPUT]
        systemsRegistry[0].update(dt);
 
        // 2. [SYSTEMS] (Lógica Intermédia)
        for (let i = 1; i < systemsRegistry.length - 1; i++) {
            systemsRegistry[i].update(dt);
        }
 
        // 3. [STATE MANAGER]
        stateManager.update(dt);
 
        // 4. [RENDER]
        systemsRegistry[systemsRegistry.length - 1].update(dt);
 
        /**
         * FASE III: POST_UPDATE (Consolidação Global)
         */
        for (const system of systemsRegistry) {
            system.postUpdate(dt);
        }
 
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
}
 
export const gameLoop = new GameLoop();
