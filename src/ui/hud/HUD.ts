/**
 * src/ui/hud/HUD.ts
 * Visualização tática de telemetria em tempo real.
 */
import { eventBus, Events } from '../../core/EventBus';
 
export class HUD {
    private domElement: HTMLElement | null = null;
 
    public initialize(): void {
        this.createDOM();
        this.subscribeToEvents();
        console.log('[UI_HUD] Tactical monitors initialized.');
    }
 
    private createDOM(): void {
        // Criação dinámica do HUD tático (Injetado via DOM)
        const hud = document.createElement('div');
        hud.id = 'tactical-hud';
        hud.style.position = 'absolute';
        hud.style.top = '20px';
        hud.style.left = '20px';
        hud.style.zIndex = '1000';
        hud.style.fontFamily = 'monospace';
        hud.style.color = '#00ff00'; // Verde militar
        hud.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
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
        this.domElement = hud;
    }
 
    private subscribeToEvents(): void {
        // SUBSCREVER TELEMETRIA DE JOGO
        eventBus.subscribe('UNIT_DAMAGED', (payload) => {
            this.updateHealth(payload.data.newHealth);
        });
 
        eventBus.subscribe('UNIT_MOVED', (payload) => {
            this.updateProgress(payload.data.x);
        });
 
        eventBus.subscribe(Events.STATE_CHANGED, (payload) => {
            this.updateState(payload.data.newState);
        });
    }
 
    private updateHealth(health: number): void {
        const el = document.getElementById('hud-health');
        if (el) el.innerText = `INTEGRITY: ${Math.max(0, health)}%`;
    }
 
    private updateProgress(x: number): void {
        const el = document.getElementById('hud-score');
        if (el) el.innerText = `PROGRESS: ${Math.floor(x)}m`;
    }
 
    private updateState(state: string): void {
        const el = document.getElementById('hud-state');
        if (el) el.innerText = `STATUS: ${state}`;
    }
}
 
export const hud = new HUD();
