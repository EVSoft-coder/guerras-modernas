/**
 * src/core/StateManager.ts
 * Gestor de Estado com Sinalização Normalizada.
 */
import { eventBus, Events, EventPayload } from './EventBus';
 
export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER'
}
 
export enum GameMode {
    VILLAGE = 'VILLAGE',
    WORLD_MAP = 'WORLD_MAP'
}
 
class StateManager {
    private _currentState: GameState = GameState.MENU;
    private _currentMode: GameMode = GameMode.VILLAGE;
 
    constructor() {
        this.initializeListeners();
    }
 
    public getMode(): GameMode {
        return this._currentMode;
    }
 
    private initializeListeners(): void {
        // Escuta mudanças de modo tático
        eventBus.subscribe(Events.GAMEMODE_CHANGED, (p: EventPayload) => {
            this._currentMode = p.data.mode as GameMode;
            console.log(`[STATE_MGR] Mode synced: ${this._currentMode}`);
        });

        // Escuta pedidos táticos normalizados
        eventBus.subscribe(Events.GAME_REQUEST_PAUSE, () => {
            this.internalTransition(GameState.PAUSED);
        });
 
        eventBus.subscribe(Events.GAME_REQUEST_RESUME, () => {
            if (this._currentState === GameState.PAUSED) {
                this.internalTransition(GameState.PLAYING);
            }
        });
    }
 
    private internalTransition(newState: GameState): void {
        if (this._currentState === newState) return;
 
        const oldState = this._currentState;
        this._currentState = newState;
        
        console.log(`[STATE_MGR] Authorized: ${oldState} -> ${newState}`);
        
        const payload: EventPayload = {
            type: Events.GAME_STATE_CHANGED,
            timestamp: Date.now(),
            data: { oldState, newState }
        };
 
        eventBus.emit(payload);
    }
 
    public getState(): GameState {
        return this._currentState;
    }
 
    public forceState(newState: GameState): void {
        this.internalTransition(newState);
    }
 
    public update(deltaTime: number): void {
        // Pulso de validação se necessário
    }
}
 
export const stateManager = new StateManager();
