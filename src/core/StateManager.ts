/**
 * StateManager.ts
 * Única autoridade para mudança de estado global.
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
 
    /**
     * Altera o estado global. Único ponto de modificação.
     */
    public changeState(newState: GameState): void {
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`[CORE_STATE] Authorized transition: ${oldState} -> ${newState}`);
        
        eventBus.emit(Events.STATE_CHANGED, {
            oldState,
            newState
        });
    }
 
    public getState(): GameState {
        return this.currentState;
    }
 
    public update(deltaTime: number): void {
        // Lógica de atualização de ticking de estado se necessário
    }
}
 
export const stateManager = new StateManager();
