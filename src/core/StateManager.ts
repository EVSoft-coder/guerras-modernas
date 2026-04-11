/**
 * StateManager.ts
 * Gestor Supremo de Estado com Privacidade Absoluta.
 */
import { eventBus, Events } from './EventBus';
 
export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER'
}
 
class StateManager {
    private _currentState: GameState = GameState.MENU;
 
    constructor() {
        this.initializeListeners();
    }
 
    private initializeListeners(): void {
        // Pedidos de rádio (Doutrina 1.1)
        eventBus.subscribe(Events.REQUEST_PAUSE, () => {
            this.internalTransition(GameState.PAUSED);
        });
 
        eventBus.subscribe(Events.REQUEST_RESUME, () => {
            if (this._currentState === GameState.PAUSED) {
                this.internalTransition(GameState.PLAYING);
            }
        });
    }
 
    /**
     * ÚNICO PONTO DE TRANSIÇÃO (INTERNO).
     * Rigorosamente privado para impedir manipulação externa ilícita.
     */
    private internalTransition(newState: GameState): void {
        if (this._currentState === newState) return;
 
        const oldState = this._currentState;
        this._currentState = newState;
        
        console.log(`[STATE_SECURITY] Authorized Transition: ${oldState} -> ${newState}`);
        
        eventBus.emit({
            type: Events.STATE_CHANGED,
            timestamp: Date.now(),
            data: { oldState, newState }
        });
    }
 
    /**
     * Acesso externo apenas de LEITURA.
     */
    public getState(): GameState {
        return this._currentState;
    }
 
    public update(deltaTime: number): void {
        // Reservado para lógica de pulso de estado
    }
}
 
export const stateManager = new StateManager();
