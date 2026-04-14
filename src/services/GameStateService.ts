/**
 * src/services/GameStateService.ts
 * ECS State Exposure for UI Layer (ReadOnly).
 */
import { entityManager } from '../core/EntityManager';
import { Logger } from '../core/Logger';
import { stateManager, GameMode } from '../core/StateManager';

export interface EntitySnapshot {
    id: number;
    type?: string;
    x: number;
    y: number;
    status?: string;
    march?: {
        target: { x: number; y: number };
        remainingTime: number;
    };
}

export interface GlobalGameState {
    player: { name: string; id: number };
    villages: Array<{ id: number; name: string; x: number; y: number }>;
    worldMapBases: Array<any>;
    rebelCount: number;
    revealedTiles: string[];
    research: Record<string, number>;
}

class GameStateService {
    private snapshots: EntitySnapshot[] = [];
    private globalState: GlobalGameState = {
        player: { name: 'OPERATIVE', id: 1 },
        villages: [],
        worldMapBases: [],
        rebelCount: 0,
        revealedTiles: [],
        research: {}
    };
    private listeners: Array<() => void> = [];

    /**
     * Captures current state of all relevant entities from ECS.
     * Called by SyncSystem at the end of every frame.
     */
    public snap(): void {
        const entities = entityManager.getEntitiesWith(['GridPosition']);
        const marches = entityManager.getEntitiesWith(['March']);
        const newSnapshots: EntitySnapshot[] = [];

        const allIds = Array.from(new Set([...entities, ...marches]));

        for (const id of allIds) {
            const gridPos = entityManager.getComponent<any>(id, 'GridPosition');
            if (gridPos && !gridPos.isVisible) continue;

            // [AUDIT] Resource calculation logic REMOVED.
            // Resources are now handled exclusively by the backend (Laravel) 
            // and managed via Inertia props/React state in the frontend.
            // This service strictly exposes ECS data for visual rendering only.
            const march = entityManager.getComponent<any>(id, 'March');
            const army = entityManager.getComponent<any>(id, 'Army');
            const village = entityManager.getComponent<any>(id, 'Village');
            const unit = entityManager.getComponent<any>(id, 'Unit');

            let x = gridPos ? gridPos.x : 0;
            let y = gridPos ? gridPos.y : 0;

            let marchData = undefined;
            if (march) {
                const now = Date.now();
                const total = march.arrivalTime - march.startTime;
                const elapsed = now - march.startTime;
                const progress = Math.min(1, Math.max(0, elapsed / (total || 1)));
                x = march.originX + (march.targetX - march.originX) * progress;
                y = march.originY + (march.targetY - march.originY) * progress;
                
                marchData = {
                    target: { x: march.targetX, y: march.targetY },
                    remainingTime: Math.max(0, (march.arrivalTime - now) / 1000)
                };
            }

            newSnapshots.push({
                id,
                type: army ? 'Army' : (unit?.unitCategory || (village ? 'VILLAGE' : (march ? 'MARCH' : undefined))),
                x,
                y,
                status: army?.status || (march ? 'em marcha' : 'operacional'),
                march: marchData
            });
        }

        this.snapshots = newSnapshots;
        this.updateGlobalSummary();
        this.notify();
    }

    private updateGlobalSummary(): void {
        const villageEntities = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        const villageList = villageEntities.map(id => {
            const v = entityManager.getComponent<any>(id, 'Village');
            const p = entityManager.getComponent<any>(id, 'GridPosition');
            return { id, name: v?.name || 'OUTPOST', x: p?.x || 0, y: p?.y || 0 };
        });

        const worldMapBases = villageEntities.map(id => {
            const v = entityManager.getComponent<any>(id, 'Village');
            const p = entityManager.getComponent<any>(id, 'GridPosition');
            return {
                id,
                nome: v?.name || 'Setor Hostil',
                coordenada_x: Math.round(p?.x || 0),
                coordenada_y: Math.round(p?.y || 0),
                loyalty: v?.loyalty || 100,
                ownerId: v?.ownerId || null,
                is_protected: v?.isProtected || false,
                protection_until: v?.protectionUntil || 0
            };
        });

        this.globalState = {
            ...this.globalState,
            player: this.globalState?.player ?? { name: 'OPERATIVE', id: 1 },
            villages: villageList,
            worldMapBases,
            rebelCount: worldMapBases.filter(b => !b.ownerId).length
        };
    }

    public getGameState(): EntitySnapshot[] {
        return this.snapshots;
    }

    public getGlobalState(): GlobalGameState {
        return this.globalState;
    }

    public updateGlobalState(data: Partial<GlobalGameState>): void {
        this.globalState = { ...this.globalState, ...data };
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

    public syncAttacks(attacks: any[]): void {
        // Implementação de sincronização (placeholder por agora para satisfazer o TS)
        Logger.info(`[SYNC] Military Command: Synchronizing ${attacks.length} operations.`);
    }
}

export const gameStateService = new GameStateService();
