/**
 * StateManager.ts
 * Gestor tático de alta autoridade para estados globais (FSM).
 */
import { eventBus } from './EventBus';
 
export type GameMode = 'VILLAGE' | 'WORLD_MAP' | 'COMBAT' | 'LOADING';
 
class StateManager {
    private currentMode: GameMode = 'VILLAGE';
    private isPaused: boolean = false;
 
    /**
     * Define o modo de jogo atual e emite sinalização de transição.
     */
    public setMode(mode: GameMode): void {
        if (this.currentMode === mode) return;
        
        const oldMode = this.currentMode;
        this.currentMode = mode;
        
        console.log(`[STATE_TRANSITION] ${oldMode} -> ${mode}`);
 
        eventBus.emit({
            type: 'GAMEMODE:CHANGED',
            timestamp: Date.now(),
            data: { mode, previous: oldMode }
        });
    }
 
    public getMode(): GameMode {
        return this.currentMode;
    }
 
    /**
     * Controlo de fluxo temporal (Pause/Resume).
     */
    public setPaused(paused: boolean): void {
        this.isPaused = paused;
        eventBus.emit({
            type: paused ? 'GAME:REQUEST_PAUSE' : 'GAME:REQUEST_RESUME',
            timestamp: Date.now(),
            data: { isPaused: paused }
        });
    }
 
    public getPaused(): boolean {
        return this.isPaused;
    }
}
 
export const stateManager = new StateManager();
