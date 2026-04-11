/**
 * src/ui/UIManager.ts
 * Gestão de Visores e Ecrãs táticos.
 */
import { eventBus } from '../core/EventBus';
import { GameState } from '../core/StateManager';
 
class UIManager {
    /**
     * Inicializa a interface.
     */
    public initialize(): void {
        eventBus.subscribe('STATE_CHANGED', (state: GameState) => {
            this.renderScreen(state);
        });
        
        console.log('[UI] Monitors active.');
    }
 
    private renderScreen(state: GameState): void {
        console.log(`[UI] Rendering Screen for: ${state}`);
        // Aqui seria a lógica de alternar entre MainMenu, GameScreen, etc.
    }
 
    /**
     * Atualiza o HUD (Heads-Up Display) com telemetria do jogo.
     */
    public updateHUD(data: { health: number, score: number }): void {
        console.log(`[HUD] INF - Health: ${data.health} | Score: ${data.score}`);
    }
}
 
export const uiManager = new UIManager();
