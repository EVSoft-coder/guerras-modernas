/**
 * GameLoop.ts
 * Ciclo principal com pipeline estrita e deltaTime de alta precisão.
 */
import { stateManager, GameState } from './StateManager';
import { systemsRegistry } from '../game/systemsRegistry';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
 
    /**
     * Inicia o ciclo de operações táticas.
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
 
        // Cálculo de Corretor de Tempo (DeltaTime em segundos)
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Limitar deltaTime para evitar saltos em caso de lag (clamping)
        const cappedDelta = Math.min(deltaTime, 0.1);
 
        /**
         * PIPELINE OPERATIVA (ORDEM OBRIGATÓRIA)
         */
         
        // 1. INPUT (Captura de sinais)
        this.processInput();
 
        // 2. SYSTEMS (Lógica de Jogo via Registry)
        if (stateManager.getState() === GameState.PLAYING) {
            this.updateSystems(cappedDelta);
        }
 
        // 3. STATE MANAGER (Validação e transição contínua)
        stateManager.update(cappedDelta);
 
        // 4. RENDER (Projeção Visual)
        this.render();
 
        requestAnimationFrame(this.loop.bind(this));
    }
 
    private processInput(): void {
        // Delegado via EventBus (InputSystem sinaliza mudanças)
    }
 
    private updateSystems(deltaTime: number): void {
        // Executa systems na ordem exata definida no Registry
        for (const system of systemsRegistry) {
            system.update(deltaTime);
        }
    }
 
    private render(): void {
        // Atualização dos visores UI (Reativo ao estado atual)
    }
}
 
export const gameLoop = new GameLoop();
