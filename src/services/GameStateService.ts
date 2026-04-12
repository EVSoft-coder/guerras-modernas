/**
 * src/services/GameStateService.ts
 * ECS State Exposure for UI Layer (ReadOnly).
 */
import { entityManager } from '../core/EntityManager';
import { stateManager, GameMode } from '../core/StateManager';
import { AttackMarchComponent } from '../game/components/AttackMarchComponent';

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

export interface GlobalGameState {
    player: { name: string; id: number };
    village: { name: string; id: number };
    resources: { wood: number; stone: number; iron: number };
    buildings: Array<{ type: string; level: number }>;
}

class GameStateService {
    private snapshots: EntitySnapshot[] = [];
    private globalState: GlobalGameState = {
        player: { name: 'OPERATIVE', id: 1 },
        village: { name: 'BASE_ALPHA', id: 1 },
        resources: { wood: 0, stone: 0, iron: 0 },
        buildings: []
    };
    private listeners: Array<() => void> = [];

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
                }
            }
        });
    }

    /**
     * Captures current state of all relevant entities.
     */
    public snap(): void {
        const entities = entityManager.getEntitiesWith(['GridPosition']);
        const marches = entityManager.getEntitiesWith(['AttackMarch']);
        const newSnapshots: EntitySnapshot[] = [];

        // TILE_SIZE constante para conversão de projeção
        const TILE_SIZE = 64;

        // Combine IDs
        const allIds = Array.from(new Set([...entities, ...marches]));

        for (const id of allIds) {
            const gridPos = entityManager.getComponent<any>(id, 'GridPosition');
            const sprite = entityManager.getComponent<any>(id, 'Sprite');
            const health = entityManager.getComponent<any>(id, 'Health');
            const selection = entityManager.getComponent<any>(id, 'Selection');
            const res = entityManager.getComponent<any>(id, 'Resource');
            const march = entityManager.getComponent<any>(id, 'AttackMarch');

            newSnapshots.push({
                id,
                x: gridPos ? gridPos.x * TILE_SIZE : 0,
                y: gridPos ? gridPos.y * TILE_SIZE : 0,
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
        this.updateGlobalSummary();
        
        // Log de estado solicitado (Doctrine Logic)
        console.log("GAME STATE:", this.globalState);
        this.notify();
    }

    private updateGlobalSummary(): void {
        const buildingEntities = entityManager.getEntitiesWith(['Building']);
        const resEntities = entityManager.getEntitiesWith(['Resource']);
        
        // Aggregate Resources
        let totalRes = { wood: 0, stone: 0, iron: 0 };
        resEntities.forEach(id => {
            const r = entityManager.getComponent<any>(id, 'Resource');
            if (r) {
                totalRes.wood += r.wood || 0;
                totalRes.stone += r.stone || 0;
                totalRes.iron += r.iron || 0;
            }
        });
        
        // Gather Buildings
        const buildingList = buildingEntities.map(id => {
            const b = entityManager.getComponent<any>(id, 'Building');
            return { type: b?.buildingType || 'STRUCTURE', level: b?.level || 1 };
        });

        // Ensure defaults and update
        this.globalState = {
            player: this.globalState?.player ?? { name: 'OPERATIVE', id: 1 },
            village: this.globalState?.village ?? { name: 'BASE_ALPHA', id: 1 },
            resources: totalRes,
            buildings: buildingList
        };

        // Extra Validation
        if (!this.globalState.player) this.globalState.player = { name: 'UNKNOWN', id: 0 };
        if (!this.globalState.village) this.globalState.village = { name: 'OUTPOST', id: 0 };
    }

    public getGameState(): EntitySnapshot[] {
        return this.snapshots;
    }

    public getGlobalState(): GlobalGameState {
        return this.globalState;
    }

    public getGameMode(): GameMode {
        return stateManager.getMode();
    }

    public getMode(): GameMode {
        return this.getGameMode();
    }

    public setMode(mode: GameMode): void {
        stateManager.setMode(mode);
        this.notify();
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public notify(): void {
        this.listeners.forEach(l => l());
    }
}

export const gameStateService = new GameStateService();
