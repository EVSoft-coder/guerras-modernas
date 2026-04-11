/**
 * src/services/GameStateService.ts
 * ECS State Exposure for UI Layer (ReadOnly).
 */
import { entityManager } from '../core/EntityManager';
import { stateManager, GameMode } from '../core/StateManager';

export interface EntitySnapshot {
    id: number;
    x: number;
    y: number;
    sprite?: string;
    health?: { current: number; max: number };
    isSelected?: boolean;
    resources?: { wood: number; stone: number; iron: number };
    march?: {
        state: string;
        remainingTime: number;
        totalTime: number;
        target: { x: number, y: number };
        loot: { wood: number; stone: number; iron: number };
    };
}

class GameStateService {
    private snapshots: EntitySnapshot[] = [];

    /**
     * Synchronizes Laravel attacks with ECS motor.
     */
    public syncAttacks(attacks: any[]): void {
        attacks.forEach(atk => {
            const eId = 10000 + atk.id; // Namespace for attack entities
            if (!entityManager.getEntitiesWith(['AttackMarch']).includes(eId)) {
                const now = Date.now();
                const arrival = new Date(atk.chegada_em).getTime();
                const total = Math.round((arrival - new Date(atk.created_at).getTime()) / 1000);
                const remaining = Math.round((arrival - now) / 1000);

                if (remaining > 0) {
                    // Note: Dynamic loading to avoid circular dependencies
                    try {
                        const { AttackMarchComponent } = require('../game/components/AttackMarchComponent');
                        entityManager.createEntity(eId);
                        entityManager.addComponent(eId, new AttackMarchComponent(
                            atk.origem_base_id,
                            atk.destino_x || 0,
                            atk.destino_y || 0,
                            atk.tropas || {},
                            total,
                            remaining,
                            'GOING'
                        ));
                    } catch (e) {
                        console.error("Failed to load AttackMarchComponent:", e);
                    }
                }
            }
        });
    }

    /**
     * Captures current state of all relevant entities.
     */
    public snap(): void {
        const entities = entityManager.getEntitiesWith(['Position']);
        const marches = entityManager.getEntitiesWith(['AttackMarch']);
        const newSnapshots: EntitySnapshot[] = [];

        // Combine IDs
        const allIds = Array.from(new Set([...entities, ...marches]));

        for (const id of allIds) {
            const pos = entityManager.getComponent<any>(id, 'Position');
            const sprite = entityManager.getComponent<any>(id, 'Sprite');
            const health = entityManager.getComponent<any>(id, 'Health');
            const selection = entityManager.getComponent<any>(id, 'Selection');
            const res = entityManager.getComponent<any>(id, 'Resource');
            const march = entityManager.getComponent<any>(id, 'AttackMarch');

            newSnapshots.push({
                id,
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
                sprite: sprite?.imagePath,
                health: health ? { current: health.value, max: health.max } : undefined,
                isSelected: !!selection,
                resources: res ? { wood: res.wood, stone: res.stone, iron: res.iron } : undefined,
                march: march ? {
                    state: march.state,
                    remainingTime: march.remainingTime,
                    totalTime: march.totalTime,
                    target: { x: march.targetX, y: march.targetY },
                    loot: { ...march.loot }
                } : undefined
            });
        }

        this.snapshots = newSnapshots;
    }

    public getGameState(): EntitySnapshot[] {
        return this.snapshots;
    }

    public getGameMode(): GameMode {
        return stateManager.getMode();
    }
}

export const gameStateService = new GameStateService();
