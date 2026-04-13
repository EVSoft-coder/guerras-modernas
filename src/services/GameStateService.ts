/**
 * src/services/GameStateService.ts
 * ECS State Exposure for UI Layer (ReadOnly).
 */
import { entityManager } from '../core/EntityManager';
import { stateManager, GameMode } from '../core/StateManager';
import { AttackMarchComponent } from '../game/components/AttackMarchComponent';
import { GLOBAL_BUILDINGS } from '../game/config/buildings';

export interface EntitySnapshot {
    id: number;
    type?: string;
    x: number;
    y: number;
    sprite?: string;
    health?: { current: number; max: number };
    name?: string;
    loyalty?: number;
    isProtected?: boolean;
    protectionUntil?: number;
    isSelected?: boolean;
    status?: "going" | "returning" | "completed";
    ownerId?: number | null;
    resources?: { suprimentos: number; combustivel: number; municoes: number; metal: number; energia: number; pessoal: number };
    march?: {
        state: string;
        remainingTime: number;
        totalTime: number;
        target: { x: number, y: number };
        loot: any;
    };
}

export interface GlobalGameState {
    player: { name: string; id: number };
    villages: Array<{ id: number; name: string; x: number; y: number }>;
    resources: { suprimentos: number; combustivel: number; municoes: number; metal: number; energia: number; pessoal: number };
    buildings: Array<{ type: string; level: number; id?: number }>;
    worldMapBases: Array<any>;
    rebelCount: number;
    revealedTiles?: string[];
    research?: Record<string, number>;
}

class GameStateService {
    private snapshots: EntitySnapshot[] = [];
    private globalState: GlobalGameState = {
        player: { name: 'OPERATIVE', id: 1 },
        villages: [],
        resources: { suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0, pessoal: 0 },
        buildings: [],
        worldMapBases: [],
        rebelCount: 0
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

        // Combine IDs
        const allIds = Array.from(new Set([...entities, ...marches]));

        for (const id of allIds) {
            const gridPos = entityManager.getComponent<any>(id, 'GridPosition');
            
            // FOG OF WAR: Se nÃ£o for visÃ­vel tactinamente, ignorar na exposiÃ§Ã£o para a UI
            if (gridPos && !gridPos.isVisible) continue;

            const sprite = entityManager.getComponent<any>(id, 'Sprite');
            const health = entityManager.getComponent<any>(id, 'Health');
            const selection = entityManager.getComponent<any>(id, 'Selection');
            const res = entityManager.getComponent<any>(id, 'Resource');
            const march = entityManager.getComponent<any>(id, 'March');
            const army = entityManager.getComponent<any>(id, 'Army');
            const building = entityManager.getComponent<any>(id, 'Building');
            const village = entityManager.getComponent<any>(id, 'Village');
            const unit = entityManager.getComponent<any>(id, 'Unit');
            const player = entityManager.getComponent<any>(id, 'Player');

            let x = gridPos ? gridPos.x : 0;
            let y = gridPos ? gridPos.y : 0;

            if (march) {
                const now = Date.now();
                const total = march.arrivalTime - march.startTime;
                const elapsed = now - march.startTime;
                const progress = Math.min(1, Math.max(0, elapsed / (total || 1)));
                x = march.originX + (march.targetX - march.originX) * progress;
                y = march.originY + (march.targetY - march.originY) * progress;
            }

            newSnapshots.push({
                id,
                type: army ? 'Army' : (building?.buildingType || unit?.unitCategory || (village ? 'VILLAGE' : (march ? 'MARCH' : undefined))),
                x,
                y,
                sprite: sprite?.imagePath,
                health: health ? { current: health.value, max: health.max } : undefined,
                loyalty: village ? village.loyalty : undefined,
                isProtected: village ? village.isProtected : undefined,
                protectionUntil: village ? village.protectionUntil : undefined,
                isSelected: !!selection,
                status: march?.status,
                ownerId: village?.ownerId ?? army?.ownerId ?? march?.ownerId ?? (player ? id : undefined),
                name: village?.name || building?.name || (army ? `Task Force ${id}` : undefined),
                resources: res ? { 
                    suprimentos: res.suprimentos, 
                    combustivel: res.combustivel, 
                    municoes: res.municoes,
                    metal: res.metal,
                    energia: res.energia,
                    pessoal: res.pessoal
                } : undefined,
                march: march ? {
                    state: march.status,
                    remainingTime: (march.arrivalTime - Date.now()) / 1000,
                    totalTime: (march.arrivalTime - march.startTime) / 1000,
                    target: { x: march.targetX, y: march.targetY },
                    loot: march.units 
                } : undefined
            });
        }

        this.snapshots = newSnapshots;
        this.updateGlobalSummary();
        this.notify();
    }

    private updateGlobalSummary(): void {
        const buildingEntities = entityManager.getEntitiesWith(['Building']);
        const resEntities = entityManager.getEntitiesWith(['Resource']);
        const villageEntities = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        
        // Aggregate Resources
        let totalRes = { suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0, pessoal: 0 };
        resEntities.forEach(id => {
            const r = entityManager.getComponent<any>(id, 'Resource');
            if (r) {
                totalRes.suprimentos += r.suprimentos || 0;
                totalRes.combustivel += r.combustivel || 0;
                totalRes.municoes += r.municoes || 0;
                totalRes.metal += r.metal || 0;
                totalRes.energia += r.energia || 0;
                totalRes.pessoal += r.pessoal || 0;
            }
        });

        // List Villages
        const villageList = villageEntities.map(id => {
            const v = entityManager.getComponent<any>(id, 'Village');
            const p = entityManager.getComponent<any>(id, 'GridPosition');
            return { id, name: v?.name || 'OUTPOST', x: p?.x || 0, y: p?.y || 0 };
        });
        
        // Gather and Hydrate Buildings (Include Level 0)
        const existingBuildings = buildingEntities.map(id => {
            const b = entityManager.getComponent<any>(id, 'Building');
            return { type: b?.buildingType || 'STRUCTURE', level: b?.level || 1, id };
        });

        const hydratedBuildings = GLOBAL_BUILDINGS.map(def => {
            const existing = existingBuildings.find(eb => eb.type.toLowerCase() === def.type.toLowerCase());
            return {
                type: def.type,
                level: existing ? existing.level : 0,
                id: existing ? existing.id : -(Math.random() * 1000)
            };
        });

        // Bake World Map Bases
        const worldMapBases = villageEntities.map(id => {
            const v = entityManager.getComponent<any>(id, 'Village');
            const p = entityManager.getComponent<any>(id, 'GridPosition');
            return {
                id,
                nome: v?.name || 'Setor Hostil',
                coordenada_x: Math.round(p?.x || 0),
                coordenada_y: Math.round(p?.y || 0),
                loyalty: v?.loyalty || 100,
                jogador_id: v?.ownerId || null,
                is_protected: v?.isProtected || false,
                protection_until: v?.protectionUntil || 0
            };
        });

        const rebelCount = worldMapBases.filter(b => !b.jogador_id).length;

        // Ensure defaults and update
        this.globalState = {
            player: this.globalState?.player ?? { name: 'OPERATIVE', id: 1 },
            villages: villageList,
            resources: totalRes,
            buildings: hydratedBuildings,
            worldMapBases,
            rebelCount
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
        console.log(`[SYNC] Military Command: Synchronizing ${attacks.length} operations.`);
    }
}

export const gameStateService = new GameStateService();
