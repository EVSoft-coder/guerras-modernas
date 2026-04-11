/**
 * GameLoop.ts
 * Ciclo principal com Ciclo de Vida Completo e Pipeline Rígida.
 */
import { stateManager, GameState } from './StateManager';
import { systemsRegistry } from '../game/systemsRegistry';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
    private initialized: boolean = false;
 
    /**
     * INIT: Preparação de sensores e sistemas core.
     */
    public init(): void {
        console.log('[GAMELOOP] Initializing tactical engine...');
        this.initialized = true;
        this.lastTime = performance.now();
    }
 
    /**
     * RUN: Inicia a execução do loop contínuo.
     */
    public run(): void {
        if (!this.initialized) {
            throw new Error('[GAMELOOP_ERROR] Engine must be initialized before running.');
        }
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        requestAnimationFrame(this.loop.bind(this));
        console.log('[GAMELOOP] Operations started.');
    }
 
    /**
     * SHUTDOWN: Cessação imediata de todas as operações.
     */
    public shutdown(): void {
        this.gameRunning = false;
        console.log('[GAMELOOP] Sustaining shutdown. All operations ceased.');
    }
 
    private loop(currentTime: number): void {
        if (!this.gameRunning) return;
 
        // Cálculo de DeltaTime de alta precisão
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Clamping para manter estabilidade em caso de lag
        const cappedDelta = Math.min(deltaTime, 0.1);
 
        /**
         * PIPELINE RIGID OPERATIONAL ORDER (IMMUTABLE)
         */
         
        // 1. INPUT (Reconhecimento de sinais)
        this.processInput();
 
        // 2. SYSTEMS (Processamento da Ordem de Batalha)
        if (stateManager.getState() === GameState.PLAYING) {
            this.updateSystems(cappedDelta);
        }
 
        // 3. STATE MANAGER (Validação contínua de estado)
        stateManager.update(cappedDelta);
 
        // 4. RENDER (Atualização dos visores)
        this.render();
 
        requestAnimationFrame(this.loop.bind(this));
    }
 
    private processInput(): void {
        // Capturado via EventBus por sistemas de input isolados
    }
 
    private updateSystems(deltaTime: number): void {
        // Executa a lista ESTÁTICA do systemsRegistry
        for (const system of systemsRegistry) {
            system.update(deltaTime);
        }
    }
 
    private render(): void {
        // Renderização delegada a sistemas UI reactivos
    }
}
 
export const gameLoop = new GameLoop();
