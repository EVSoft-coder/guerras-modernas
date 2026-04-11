/**
 * GameLoop.ts
 * Ciclo principal com Pipeline Táctico em 4 Fases.
 */
import { stateManager, GameState } from './StateManager';
import { systemsRegistry, GameSystem } from '../game/systemsRegistry';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
    private initialized: boolean = false;
 
    /**
     * INIT: Inicialização de todos os subsistemas da ordem de batalha.
     */
    public init(): void {
        console.log('[GAMELOOP] Starting Tactical Initialization...');
        for (const system of systemsRegistry) {
            system.init();
        }
        this.initialized = true;
        this.lastTime = performance.now();
    }
 
    /**
     * RUN: Ativação do motor rítmico.
     */
    public run(): void {
        if (!this.initialized) {
            throw new Error('[GAMELOOP_CRITICAL] Engine must be initialized first.');
        }
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        console.log('[GAMELOOP] Operations Active. Pipeline sequence:');
        console.log('1. [INPUT] -> 2. [LOGIC SYSTEMS] -> 3. [STATE] -> 4. [RENDER]');
        
        requestAnimationFrame(this.loop.bind(this));
    }
 
    /**
     * SHUTDOWN: Cessação e destruição de subsistemas.
     */
    public shutdown(): void {
        this.gameRunning = false;
        for (const system of systemsRegistry) {
            system.destroy();
        }
        console.log('[GAMELOOP] Total Shutdown. All stations offline.');
    }
 
    private loop(currentTime: number): void {
        if (!this.gameRunning) return;
 
        // DeltaTime de alta precisão (seconds)
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        const cappedDelta = Math.min(deltaTime, 0.1);
 
        /**
         * PIPELINE RIGIDO (Fase 3 - Doutrina 1.1)
         */
         
        // 1. [INPUT] - Geralmente o primeiro da lista
        systemsRegistry[0].update(cappedDelta);
 
        // 2. [SYSTEMS] - Lógica intermédia
        for (let i = 1; i < systemsRegistry.length - 1; i++) {
            systemsRegistry[i].update(cappedDelta);
        }
 
        // 3. [STATE MANAGER] - Validação e transições
        stateManager.update(cappedDelta);
 
        // 4. [RENDER] - Último sistema da lista (Projeção)
        if (systemsRegistry.length > 1) {
            systemsRegistry[systemsRegistry.length - 1].update(cappedDelta);
        }
 
        requestAnimationFrame(this.loop.bind(this));
    }
}
 
export const gameLoop = new GameLoop();
