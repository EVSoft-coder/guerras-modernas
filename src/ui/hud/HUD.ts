/**
 * src/ui/hud/HUD.ts
 * Telemetria Visual Sincronizada com Doutrina v1.2.
 */
import { eventBus, Events, EventPayload } from '../../core/EventBus';
 
export class HUD {
    public initialize(): void {
        this.createDOM();
        this.subscribeToEvents();
        console.log('[UI_HUD] Tactical Monitors NORMALIZING.');
    }
 
    private createDOM(): void {
        const hud = document.createElement('div');
        hud.id = 'tactical-hud';
        hud.style.position = 'absolute';
        hud.style.top = '20px';
        hud.style.left = '20px';
        hud.style.zIndex = '1000';
        hud.style.fontFamily = 'monospace';
        hud.style.color = '#00ff00';
        hud.style.backgroundColor = 'rgba(0,0,0,0.7)';
        hud.style.padding = '15px';
        hud.style.borderLeft = '4px solid #00ff00';
        hud.style.pointerEvents = 'none';
        
        hud.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">>>> RADAR TELEMETRY</div>
            <div id="hud-state">STATUS: OPERATIONAL</div>
            <div id="hud-health">INTEGRITY: 100%</div>
            <div id="hud-score">PROGRESS: 0m</div>
        `;
        
        document.body.appendChild(hud);
    }
 
    private subscribeToEvents(): void {
        // Subscrever aos novos canais normalizados
        eventBus.subscribe(Events.COMBAT_UNIT_DAMAGED, (p: EventPayload) => {
            this.updateHealth(p.data.newHealth);
        });
 
        eventBus.subscribe(Events.PLAYER_MOVE_ORDER, (p: EventPayload) => {
            this.updateProgress(p.data.targetX); // Exemplo de telemetria de progresso
        });
 
        eventBus.subscribe(Events.GAME_STATE_CHANGED, (p: EventPayload) => {
            this.updateState(p.data.newState);
        });
    }
 
    private updateHealth(health: number): void {
        const el = document.getElementById('hud-health');
        if (el) el.innerText = `INTEGRITY: ${Math.max(0, health)}%`;
    }
 
    private updateProgress(x: number): void {
        const el = document.getElementById('hud-score');
        // Simulação de cálculo de distância tática
        if (el) el.innerText = `DESTINATION_X: ${Math.floor(x)}m`;
    }
 
    private updateState(state: string): void {
        const el = document.getElementById('hud-state');
        if (el) el.innerText = `STATUS: ${state}`;
    }
}
 
export const hud = new HUD();
