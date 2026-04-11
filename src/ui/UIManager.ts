/**
 * src/ui/UIManager.ts
 * Gestor de Ecrãs e Hud (UI Layer).
 */
import { eventBus, Events } from '../core/EventBus';
import { GameState } from '../core/StateManager';
import { hud } from './hud/HUD';
 
class UIManager {
    private screens: Map<GameState, HTMLElement> = new Map();
 
    /**
     * Inicializa a interface global e os subsistemas.
     */
    public initialize(): void {
        console.log('[UI_MGR] Initializing Command Interfaces...');
        
        // Inicializar HUDS
        hud.initialize();
 
        // Monitorizar mudanças de estado para alternar ecrãs
        eventBus.subscribe(Events.STATE_CHANGED, (payload) => {
            this.handleStateChange(payload.data.newState);
        });
 
        this.createScreens();
        console.log('[UI_MGR] Screens and Monitors ACTIVE.');
    }
 
    private handleStateChange(newState: GameState): void {
        console.log(`[UI_MGR] Switching visual output to: ${newState}`);
        
        // Esconder todos os ecrãs
        this.screens.forEach(screen => {
            screen.style.display = 'none';
        });
 
        // Mostrar ecrã do estado atual
        const activeScreen = this.screens.get(newState);
        if (activeScreen) {
            activeScreen.style.display = 'flex';
        }
    }
 
    private createScreens(): void {
        // Exemplo: Criar ecrã de MENU inicial
        const menuScreen = this.createScreen(GameState.MENU, 'MAIN_MENU');
        menuScreen.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 64px; margin-bottom: 20px;">GUERRAS MODERNAS</h1>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 50px;">TACTICAL SIMULATION INITIALIZED</p>
                <button id="btn-start" style="padding: 15px 40px; font-size: 20px; cursor: pointer; background: #00ff00; color: #000; font-weight: bold; border: none;">START_MISSION</button>
            </div>
        `;
        document.body.appendChild(menuScreen);
        
        // Botão de início (emite evento estratégico)
        menuScreen.querySelector('#btn-start')?.addEventListener('click', () => {
            // Em vez de mudar estado aqui, o UI sugere a mudança ao sistema (não implementado o "Request" aqui por simplicidade)
            // No futuro: eventBus.emit('UI_START_CLICKED', {});
        });
 
        // Ecrã de Jogo (GameScreen) - Geralmente transparente para o canvas, mas com overlays
        const gameScreen = this.createScreen(GameState.PLAYING, 'GAME_SCREEN');
        document.body.appendChild(gameScreen);
        
        // Ecrã de Pausa
        const pauseScreen = this.createScreen(GameState.PAUSED, 'PAUSE_SCREEN');
        pauseScreen.innerHTML = `
            <div style="text-align: center; background: rgba(0,0,0,0.8); padding: 40px; border: 2px solid #00ff00;">
                <h2 style="font-size: 48px;">PAUSE</h2>
                <p>SIMULATION SUSPENDED</p>
                <button id="btn-resume">RESUME_OPERATIONS</button>
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
