/**
 * src/game/systems/GameModeSystem.ts
 * Gestor de Perspetiva EstratÃ©gica (Vila vs Mapa Mundo).
 */
import { eventBus, Events, EventPayload } from '../../core/EventBus';
import { GameSystem } from './types';

export type GameMode = "VILLAGE" | "WORLD_MAP";

export class GameModeSystem implements GameSystem {
    private currentMode: GameMode = "VILLAGE";

    public init(): void {
        console.log(`[SYSTEM] GameModeSystem - Strategy Layer ONLINE. Initial Mode: ${this.currentMode}`);
        
        // Subscrever ao pedido de troca de modo
        eventBus.subscribe(Events.GAME_CHANGE_MODE, (payload: EventPayload) => {
            if (payload.data && payload.data.mode) {
                this.handleModeChange(payload.data.mode as GameMode);
            }
        });
    }

    private handleModeChange(newMode: GameMode): void {
        if (newMode !== "VILLAGE" && newMode !== "WORLD_MAP") {
            console.error(`[GAMEMODE_SYSTEM] Invalid mode requested: ${newMode}`);
            return;
        }

        if (this.currentMode === newMode) return;

        console.log(`[GAMEMODE_SYSTEM] Perspective shift: ${this.currentMode} -> ${newMode}`);
        this.currentMode = newMode;

        // Notificar outros sistemas se necessÃ¡rio (sem tocar na UI diretamente)
        eventBus.emit({
            type: Events.GAMEMODE_CHANGED,
            timestamp: Date.now(),
            data: { mode: this.currentMode }
        });
    }

    public getCurrentMode(): GameMode {
        return this.currentMode;
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] GameModeSystem - Strategy Layer OFFLINE.');
    }
}

export const gameModeSystem = new GameModeSystem();
