/**
 * GameLoop.ts - Doutrina de Estabilização v1.0.
 * Ciclo principal com Pipeline Táctico Rígido.
 */
import { stateManager } from './StateManager';
import { systemsRegistry } from '../game/systems/systemsRegistry';
 
class GameLoop {
    private gameRunning: boolean = false;
    private lastTime: number = 0;
    private initialized: boolean = false;
    private animationFrameId: number | null = null;
 
    /**
     * INIT: Inicialização sequencial de todos os subsistemas.
     */
    public init(): void {
        if (this.initialized) return;
 
        console.log('[GAMELOOP] Starting Tactical Initialization...');
        
        for (const system of systemsRegistry) {
            system.init();
        }
 
        this.initialized = true;
        this.lastTime = performance.now();
        console.log('[GAMELOOP] Initialization Complete.');
    }
 
    /**
     * RUN: Início da simulação tática.
     */
    public run(): void {
        if (!this.initialized) {
            this.init();
        }
        if (this.gameRunning) return;
 
        this.gameRunning = true;
        console.log('[GAMELOOP] Mission Active. Pipeline: Input -> Systems -> State -> Render');
        
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
 
    /**
     * SHUTDOWN: Cessação imediata de todas as operações.
     */
    public shutdown(): void {
        this.gameRunning = false;
        
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
 
        for (const system of systemsRegistry) {
            system.destroy();
        }
 
        console.log('[GAMELOOP] System Shutdown. All stations offline.');
    }
 
    /**
     * LOOP: Ciclo rítmico determinístico.
     */
    private loop(currentTime: number): void {
        if (!this.gameRunning) return;
 
        // 1. CÁLCULO EXPLÍCITO DE DELTATIME
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Proteção contra saltos gigantes de frame (ex: mudança de tab)
        const cappedDelta = Math.min(deltaTime, 0.1);
 
        /**
         * 2. PIPELINE FIXO E IMUTÁVEL
         */
         
        // FASE A: [INPUT] (Sempre o primeiro elemento do registry)
        systemsRegistry[0].update(cappedDelta);
 
        // FASE B: [SYSTEMS] (Lógica tática intermédia)
        for (let i = 1; i < systemsRegistry.length - 1; i++) {
            systemsRegistry[i].update(cappedDelta);
        }
 
        // FASE C: [STATE MANAGER] (Validação e consolidação de estado interno)
        stateManager.update(cappedDelta);
 
        // FASE D: [RENDER] (Sempre o último elemento do registry)
        systemsRegistry[systemsRegistry.length - 1].update(cappedDelta);
 
        // Agendar próximo ciclo
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
}
 
export const gameLoop = new GameLoop();
