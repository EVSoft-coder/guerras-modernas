/**
 * src/ui/UIManager.ts
 * Gestor de Interfaces Sincronizado com Doutrina v1.2.
 */
import { eventBus, Events, EventPayload } from '../core/EventBus';
import { GameState } from '../core/StateManager';
import { hud } from './hud/HUD';
import { villageView } from './village/VillageView';
import { worldMapView } from './map/WorldMapView';
import { GameMode } from '../core/StateManager';
 
class UIManager {
    private screens: Map<GameState, HTMLElement> = new Map();
 
    public initialize(): void {
        console.log('[UI_MGR] Commands Interfaces NORMALIZING.');
        
        hud.initialize();
        villageView.initialize();
        worldMapView.initialize();
 
        // Subscrever à mudança de estado tático (Vila / Mapa)
        eventBus.subscribe(Events.GAMEMODE_CHANGED, (p: EventPayload) => {
            this.handleModeChange(p.data.mode as GameMode);
        });

        // Subscrever à mudança de estado normalizada
        eventBus.subscribe(Events.GAME_STATE_CHANGED, (p: EventPayload) => {
            this.handleStateChange(p.data.newState);
            // Se entramos em PLAYING, garantimos que a vista inicial está correta
            if (p.data.newState === GameState.PLAYING) {
                villageView.show();
            }
        });
 
        this.createScreens();
    }

    private handleModeChange(mode: GameMode): void {
        if (mode === GameMode.WORLD_MAP) {
            villageView.hide();
            worldMapView.show();
        } else {
            worldMapView.hide();
            villageView.show();
        }
    }
 
    private handleStateChange(newState: GameState): void {
        this.screens.forEach(screen => {
            screen.style.display = 'none';
        });
 
        const activeScreen = this.screens.get(newState);
        if (activeScreen) {
            activeScreen.style.display = 'flex';
        }
    }
 
    private createScreens(): void {
        const menuScreen = this.createScreen(GameState.MENU, 'MAIN_MENU');
        menuScreen.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 64px; margin-bottom: 20px;">GUERRAS MODERNAS</h1>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 50px;">DOUCTRINE V1.2 - NORMALIZED SIGNAL</p>
                <button id="btn-start" style="padding: 15px 40px; font-size: 20px; cursor: pointer; background: #00ff00; color: #000; font-weight: bold; border: none;">START_MISSION</button>
            </div>
        `;
        document.body.appendChild(menuScreen);
 
        const gameScreen = this.createScreen(GameState.PLAYING, 'GAME_SCREEN');
        document.body.appendChild(gameScreen);
        
        const pauseScreen = this.createScreen(GameState.PAUSED, 'PAUSE_SCREEN');
        pauseScreen.innerHTML = `
            <div style="text-align: center; background: rgba(0,0,0,0.8); padding: 40px; border: 2px solid #00ff00;">
                <h2 style="font-size: 48px;">PAUSE</h2>
                <p>DOCTRINE VALIDATION ACTIVE</p>
            </div>
        `;
        document.body.appendChild(pauseScreen);
    }
 
    private createScreen(state: GameState, id: string): HTMLElement {
        const el = document.createElement('div');
        el.id = id;
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100vw';
        el.style.height = '100vh';
        el.style.display = 'none';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.backgroundColor = 'rgba(0,0,0,0.5)';
        el.style.color = '#fff';
        el.style.fontFamily = 'monospace';
        el.style.zIndex = '500';
        
        this.screens.set(state, el);
        return el;
    }
}
 
export const uiManager = new UIManager();
