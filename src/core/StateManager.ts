/**
 * StateManager.ts
 * Gestor tático de alta autoridade para estados globais (FSM).
 */
import { eventBus, Events } from './EventBus';
 
export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAMEOVER = 'GAMEOVER'
}

export enum GameMode {
    VILLAGE = 'VILLAGE',
    WORLD_MAP = 'WORLD_MAP',
    COMBAT = 'COMBAT',
    LOADING = 'LOADING'
}
 
class StateManager {
    private currentMode: GameMode = GameMode.VILLAGE;
    private currentState: GameState = GameState.MENU;
    private isPaused: boolean = false;
 
    /**
     * Define o estado operacional (Menu, Jogo, etc).
     */
    public setState(state: GameState): void {
        if (this.currentState === state) return;
        const oldState = this.currentState;
        this.currentState = state;
        
        eventBus.emit({
            type: Events.GAME_STATE_CHANGED,
            timestamp: Date.now(),
            data: { newState: state, oldState }
        });
    }

    public getState(): GameState {
        return this.currentState;
    }

    /**
     * Define o modo de jogo atual e emite sinalização de transição.
     */
    public setMode(mode: GameMode): void {
        if (this.currentMode === mode) return;
        
        const oldMode = this.currentMode;
        this.currentMode = mode;
        
        console.log(`[STATE_TRANSITION] ${oldMode} -> ${mode}`);
 
        eventBus.emit({
            type: Events.GAMEMODE_CHANGED,
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
            type: paused ? Events.GAME_REQUEST_PAUSE : Events.GAME_REQUEST_RESUME,
            timestamp: Date.now(),
            data: { isPaused: paused }
        });
    }
 
    public getPaused(): boolean {
        return this.isPaused;
    }
}
 
export const stateManager = new StateManager();
