/**
 * StateManager.ts
 * Bunker de Autoridade de Estado Global.
 */
import { eventBus, Events } from './EventBus';
 
export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER'
}
 
class StateManager {
    private currentState: GameState = GameState.MENU;
 
    constructor() {
        this.initializeListeners();
    }
 
    private initializeListeners(): void {
        // Escuta pedidos de mudança de estado via EventBus
        eventBus.subscribe(Events.REQUEST_PAUSE, () => this.changeState(GameState.PAUSED));
        eventBus.subscribe(Events.REQUEST_RESUME, () => this.changeState(GameState.PLAYING));
    }
 
    /**
     * Altera o estado global. Único ponto de modificação autorizado.
     */
    private changeState(newState: GameState): void {
        if (this.currentState === newState) return;
 
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`[STATE_BUNKER] Transition Authorized: ${oldState} -> ${newState}`);
        
        eventBus.emit({
            type: Events.STATE_CHANGED,
            timestamp: Date.now(),
            data: { oldState, newState }
        });
    }
 
    public getState(): GameState {
        return this.currentState;
    }
 
    /**
     * Interface externa pública (controlada) para forçar estados se necessário por lógica core.
     */
    public forceState(newState: GameState): void {
        this.changeState(newState);
    }
}
 
export const stateManager = new StateManager();
