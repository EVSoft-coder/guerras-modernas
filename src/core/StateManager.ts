/**
 * StateManager.ts
 * Gestor tático de alta autoridade para estados globais (FSM).
 */
import { eventBus, Events } from './EventBus';
import { entityManager } from './EntityManager';

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

    /**
     * Sistema de Subversão e Conquista (Autoridade de Estado).
     */
    public initConquestProcedures(): void {
        eventBus.subscribe('VILLAGE:LOYALTY_REDUCE', (payload: any) => {
            const { targetId, amount, attackerId } = payload;
            const village = entityManager.getComponent<any>(targetId, 'Village');
            
            if (village) {
                const oldLoyalty = village.loyalty;
                village.loyalty = Math.min(100, Math.max(0, village.loyalty - amount));
                
                if (oldLoyalty !== village.loyalty) {
                    console.log(`[STATE] Sovereignty at risk in Sector ${targetId}. Loyalty: ${village.loyalty}%`);
                    eventBus.emit('VILLAGE:UPDATE', { villageId: targetId });
                }
                
                if (village.loyalty <= 0) {
                    this.executeConquest(targetId, attackerId);
                }
            }
        });
    }

    private executeConquest(villageId: number, conquerorId: number): void {
        const village = entityManager.getComponent<any>(villageId, 'Village');
        const army = entityManager.getComponent<any>(villageId, 'Army');
        
        if (village) {
            console.log(`[STATE] TERRITORY ANNEXED: Sector ${villageId} now under command of Player ${conquerorId}`);
            village.ownerId = conquerorId;
            village.loyalty = 100; // Reset total pós-conquista
            village.isRebel = false;

            // Ativar Proteção Pós-Conquista (15 minutos)
            village.isProtected = true;
            village.protectionUntil = Date.now() + (15 * 60 * 1000);
        }
        
        if (army) {
            army.units = {}; // Desmilitarização do sector ocupado
        }

        // Sinalização Global da Mudança de Soberania
        eventBus.emit('VILLAGE:CONQUERED', { villageId, ownerId: conquerorId });
        eventBus.emit('VILLAGE:UPDATE', { villageId });
    }
}
 
export const stateManager = new StateManager();
stateManager.initConquestProcedures();
