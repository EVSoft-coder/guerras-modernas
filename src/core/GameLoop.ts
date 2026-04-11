/**
 * GameLoop.ts
 * Ciclo principal de processamento do jogo.
 */
import { stateManager, GameState } from './StateManager';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
 
    /**
     * Inicia o ciclo de operações.
     */
    public start(): void {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }
 
    public stop(): void {
        this.gameRunning = false;
    }
 
    private loop(currentTime: number): void {
        if (!this.gameRunning) return;
 
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
 
        // 1. Process Input
        this.processInput();
 
        // 2. Update (Apenas se não estiver pausado)
        if (stateManager.getState() !== GameState.PAUSED) {
            this.update(deltaTime);
        }
 
        // 3. Render
        this.render();
 
        requestAnimationFrame(this.loop.bind(this));
    }
 
    private processInput(): void {
        // Delegado para o InputSystem via EventBus
    }
 
    private update(deltaTime: number): void {
        // Atualização de todos os sistemas registrados
    }
 
    private render(): void {
        // Renderização da UI Layer e Gráficos
    }
}
 
export const gameLoop = new GameLoop();
