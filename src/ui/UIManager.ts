/**
 * src/ui/UIManager.ts
 * Gestor de Interfaces Sincronizado com Doutrina v1.2.
 */
import { eventBus, Events, EventPayload } from '../core/EventBus';
import { hud } from './hud/HUD';
import { villageView } from './village/VillageView';
import { worldMapView } from './map/WorldMapView';
import { stateManager, GameState, GameMode } from '../core/StateManager';
 
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

        // Subscrever à mudança de estado operacional (Menu / Pause / Jogo)
        eventBus.subscribe(Events.GAME_STATE_CHANGED, (p: EventPayload) => {
            const newState = p.data.newState as GameState;
            this.handleStateChange(newState);

            // Renderização Condicional baseada no Modo de Jogo
            if (newState === GameState.PLAYING) {
                this.handleModeChange(stateManager.getMode());
            } else {
                villageView.hide();
                worldMapView.hide();
            }
        });
 
        // Atalho para Telemetria (Tecla T)
        let hudVisible = false;
        eventBus.subscribe(Events.INPUT_KEY_DOWN, (p: EventPayload) => {
            if (p.data.code === 'KeyT') {
                hudVisible = !hudVisible;
                if (hudVisible) {
                    hud.show();
                    if (stateManager.getMode() === GameMode.VILLAGE) villageView.show();
                } else {
                    hud.hide();
                    villageView.hide();
                }
                console.log(`[UI] Telemetry ${hudVisible ? 'ENABLED' : 'DISABLED'}`);
            }
        });

        this.createScreens();
    }

    private handleModeChange(mode: GameMode): void {
        console.log("CURRENT MODE:", mode);
        if (mode === GameMode.WORLD_MAP) {
            villageView.hide();
            worldMapView.show();
        } else {
            worldMapView.hide();
            // villageView.show(); // Desativado: Agora controlado por toggle 'T'
        }
    }

 
    private handleStateChange(newState: GameState): void {
        this.screens.forEach(screen => {
            screen.style.display = 'none';
            screen.style.pointerEvents = 'none';
        });
 
        const activeScreen = this.screens.get(newState);
        if (activeScreen) {
            activeScreen.style.display = 'flex';
            // Se for o jogo principal, podemos querer clicar através dele para o React em certas áreas,
            // mas para menus e pause, precisamos de interação total.
            activeScreen.style.pointerEvents = (newState === GameState.PLAYING) ? 'none' : 'auto';
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
        el.style.backgroundColor = 'transparent'; // Fundo transparente por padrão
        el.style.color = '#fff';
        el.style.fontFamily = 'monospace';
        el.style.zIndex = '400'; // Reduzido ligeiramente para evitar sobrepor overlays críticos
        el.style.pointerEvents = 'none'; // CRÍTICO: Não bloquear cliques por padrão
        
        this.screens.set(state, el);
        return el;
    }
}
 
export const uiManager = new UIManager();
