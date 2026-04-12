/**
 * src/game/systems/IntelSystem.ts
 * Gestão de Reconhecimento e Nevoeiro de Guerra (FOW).
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { gameStateService } from '../../services/GameStateService';

export class IntelSystem implements GameSystem {
    private revealedTiles: Set<string> = new Set();
    private lastUpdate = 0;
    private UPDATE_INTERVAL = 1000; // Atualizar FOW a cada 1s para performance

    public init(): void {
        console.log('[SYSTEM] IntelSystem - Recon Protocols ONLINE.');
    }

    public update(deltaTime: number): void {
        const now = Date.now();
        if (now - this.lastUpdate < this.UPDATE_INTERVAL) return;
        this.lastUpdate = now;

        this.revealedTiles.clear();
        
        // Unidades revelam área em redor
        const units = entityManager.getEntitiesWith(['Unit', 'GridPosition']);
        for (const id of units) {
            const unit = entityManager.getComponent<any>(id, 'Unit');
            const pos = entityManager.getComponent<any>(id, 'GridPosition');
            
            if (unit && pos) {
                // DRONES têm alcance maior (2.5x base)
                const baseRange = unit.intelRange || 2;
                const multiplier = unit.unitCategory === 'drone' ? 2.5 : 1.0;
                const range = Math.floor(baseRange * multiplier);
                
                this.revealArea(pos.x, pos.y, range);
            }
        }

        // Vilas também revelam área
        const villages = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        for (const id of villages) {
            const pos = entityManager.getComponent<any>(id, 'GridPosition');
            if (pos) this.revealArea(pos.x, pos.y, 4); // Alcance base da vila
        }

        gameStateService.updateGlobalState({ revealedTiles: Array.from(this.revealedTiles) });
    }

    private revealArea(cx: number, cy: number, range: number): void {
        for (let y = cy - range; y <= cy + range; y++) {
            for (let x = cx - range; x <= cx + range; x++) {
                this.revealedTiles.add(`${x},${y}`);
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}
    public destroy(): void {}
}
