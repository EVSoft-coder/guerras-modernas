/**
 * src/services/GameStateService.ts
 * Exposição de Estado ECS para Camada UI (ReadOnly).
 */
import { entityManager } from '../core/EntityManager';
 
export interface EntitySnapshot {
    id: number;
    x: number;
    y: number;
    sprite?: string;
    health?: { current: number; max: number };
    isSelected?: boolean;
}
 
class GameStateService {
    private snapshots: EntitySnapshot[] = [];
 
    /**
     * Captura o estado actual de todas as entidades relevantes.
     * Chamado pelo GameLoop a cada frame.
     */
    public snap(): void {
        const entities = entityManager.getEntitiesWith(['Position']);
        const newSnapshots: EntitySnapshot[] = [];
 
        for (const id of entities) {
            const pos = entityManager.getComponent<any>(id, 'Position');
            const sprite = entityManager.getComponent<any>(id, 'Sprite');
            const health = entityManager.getComponent<any>(id, 'Health');
            const selection = entityManager.getComponent<any>(id, 'Selection');
 
            newSnapshots.push({
                id,
                x: pos.x,
                y: pos.y,
                sprite: sprite?.imagePath,
                health: health ? { current: health.value, max: health.max } : undefined,
                isSelected: !!selection
            });
        }
 
        this.snapshots = newSnapshots;
    }
 
    /**
     * Retorna o estado actual para a UI.
     */
    public getGameState(): EntitySnapshot[] {
        return this.snapshots;
    }
}
 
export const gameStateService = new GameStateService();
鼓
