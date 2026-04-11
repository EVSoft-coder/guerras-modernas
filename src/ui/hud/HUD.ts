/**
 * src/ui/hud/HUD.ts
 * Telemetria Visual e NavegaÃ§Ã£o EstratÃ©gica.
 */
import { eventBus, Events, EventPayload } from '../../core/EventBus';
import { GameMode } from '../../core/StateManager';

export class HUD {
    public show(): void {
        const el = document.getElementById('tactical-hud');
        if (el) el.style.display = 'block';
    }

    public hide(): void {
        const el = document.getElementById('tactical-hud');
        if (el) el.style.display = 'none';
    }

    public initialize(): void {
        this.createDOM();
        this.subscribeToEvents();
        console.log('[UI_HUD] Tactical Monitors & Navigation ONLINE.');
    }

    private createDOM(): void {
        const hud = document.createElement('div');
        hud.id = 'tactical-hud';
        hud.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            display: none; /* Oculto por defeito */
            z-index: 1000;
            font-family: monospace;
            color: #00ff00;
            background: rgba(0,0,0,0.8);
            padding: 15px;
            border-left: 4px solid #00ff00;
            min-width: 200px;
        `;

        
        hud.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #00ff0033;">>>> RADAR TELEMETRY</div>
            <div id="hud-state">STATUS: OPERATIONAL</div>
            <div id="hud-health">INTEGRITY: 100%</div>
            <div id="hud-score">PROGRESS: 0m</div>

            <div style="font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #00ff0033;">>>> STRATEGIC_NAV</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="nav-village" style="
                    background: #00ff00; color: #000; border: none; padding: 8px; 
                    font-family: monospace; font-weight: bold; cursor: pointer;
                ">BASE_OPERATIVA</button>
                
                <button id="nav-map" style="
                    background: #000; color: #00ff00; border: 1px solid #00ff00; padding: 8px; 
                    font-family: monospace; font-weight: bold; cursor: pointer;
                ">MAPA_MUNDIAL</button>
            </div>
        `;
        
        document.body.appendChild(hud);

        // Bind Buttons
        document.getElementById('nav-village')?.addEventListener('click', () => {
            console.log("CLICK BASE");
            this.changeMode('VILLAGE');
        });

        document.getElementById('nav-map')?.addEventListener('click', () => {
            console.log("CLICK MAPA");
            eventBus.emit({
                type: Events.GAME_CHANGE_MODE,
                timestamp: Date.now(),
                data: { mode: "WORLD_MAP" }
            });
        });
    }

    private changeMode(mode: string): void {
        eventBus.emit({
            type: Events.GAME_CHANGE_MODE,
            timestamp: Date.now(),
            data: { mode }
        });
    }

    private subscribeToEvents(): void {
        eventBus.subscribe(Events.COMBAT_UNIT_DAMAGED, (p: EventPayload) => {
            this.updateHealth(p.data.newHealth);
        });

        eventBus.subscribe(Events.PLAYER_MOVE_ORDER, (p: EventPayload) => {
            this.updateProgress(p.data.targetX);
        });

        eventBus.subscribe(Events.GAME_STATE_CHANGED, (p: EventPayload) => {
            this.updateState(p.data.newState);
        });

        eventBus.subscribe(Events.GAMEMODE_CHANGED, (p: EventPayload) => {
            this.updateNavButtons(p.data.mode);
        });
    }

    private updateNavButtons(mode: string): void {
        const btnVillage = document.getElementById('nav-village');
        const btnMap = document.getElementById('nav-map');

        if (mode === 'VILLAGE') {
            if (btnVillage) { btnVillage.style.background = '#00ff00'; btnVillage.style.color = '#000'; }
            if (btnMap) { btnMap.style.background = '#000'; btnMap.style.color = '#00ff00'; }
        } else {
            if (btnVillage) { btnVillage.style.background = '#000'; btnVillage.style.color = '#00ff00'; }
            if (btnMap) { btnMap.style.background = '#00ff00'; btnMap.style.color = '#000'; }
        }
    }

    private updateHealth(health: number): void {
        const el = document.getElementById('hud-health');
        if (el) el.innerText = `INTEGRITY: ${Math.max(0, health)}%`;
    }

    private updateProgress(x: number): void {
        const el = document.getElementById('hud-score');
        if (el) el.innerText = `DESTINATION_X: ${Math.floor(x)}m`;
    }

    private updateState(state: string): void {
        const el = document.getElementById('hud-state');
        if (el) el.innerText = `STATUS: ${state}`;
    }
}

export const hud = new HUD();
