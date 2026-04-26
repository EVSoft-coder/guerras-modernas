/**
 * src/game/systems/WorldMapSyncSystem.ts
 * Responsável por manter o ECS populado com dados do mapa vindos do backend.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { stateManager, GameMode } from '../../core/StateManager';
import axios from 'axios';

export class WorldMapSyncSystem implements GameSystem {
    private lastFetchTime: number = 0;
    private FETCH_INTERVAL = 10000; // 10 segundos
    private CHUNK_SIZE = 50;
    private loadedChunks: Set<string> = new Set();
    private isFetching = false;

    public init(): void {
        console.log('[SYSTEM] WorldMapSyncSystem - Monitoring global geology.');
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        const now = Date.now();
        if (now - this.lastFetchTime < this.FETCH_INTERVAL) return;
        if (this.isFetching) return;

        // Apenas sincronizar se estivermos no modo mapa ou se o cache estiver vazio
        if (stateManager.getMode() === 'WORLD_MAP' || this.loadedChunks.size === 0) {
            this.syncVisibleChunks();
            this.lastFetchTime = now;
        }
    }

    private async syncVisibleChunks() {
        this.isFetching = true;
        try {
            // Em um sistema real, pegaríamos a posição da câmera. 
            // Aqui vamos assumir um centro genérico ou buscar o player.
            const playerBaseId = 1; // Simplificação
            const cx = 500; // Coordenada central padrão
            const cy = 500;

            const chunkX = Math.floor(cx / this.CHUNK_SIZE);
            const chunkY = Math.floor(cy / this.CHUNK_SIZE);

            // Carregar o chunk central e vizinhos
            const neighbors = [[0,0], [-1,0],[1,0],[0,-1],[0,1]];
            
            for (const [dx, dy] of neighbors) {
                const nx = chunkX + dx;
                const ny = chunkY + dy;
                const key = `${nx}-${ny}`;

                if (!this.loadedChunks.has(key)) {
                    await this.fetchChunk(nx, ny);
                    this.loadedChunks.add(key);
                }
            }
        } finally {
            this.isFetching = false;
        }
    }

    private async fetchChunk(cx: number, cy: number) {
        try {
            const response = await axios.get(`/api/mapa/chunk/${cx}/${cy}`);
            const bases = response.data.bases || [];

            bases.forEach((b: any) => {
                const entityId = 20000 + b.id; // Namespace para bases
                
                // Se a entidade não existe, cria. Se existe, atualiza componentes.
                if (!entityManager.hasComponent(entityId, 'Village')) {
                    entityManager.createEntity(entityId);
                    entityManager.addComponent(entityId, new VillageComponent(
                        b.jogador_id,
                        b.id, // dbId
                        b.nivel || 1,
                        undefined, // Resources will be updated via specific sync if needed
                        b.nome,
                        !b.jogador_id,
                        b.loyalty || 100,
                        b.is_protected,
                        b.protection_until ? new Date(b.protection_until).getTime() : 0,
                        b.jogador?.alianca_id || null
                    ));
                    entityManager.addComponent(entityId, new GridPositionComponent(b.coordenada_x, b.coordenada_y, true));
                } else {
                    // Update existing village components
                    const village = entityManager.getComponent<VillageComponent>(entityId, 'Village');
                    if (village) {
                        village.ownerId = b.jogador_id;
                        village.loyalty = b.loyalty || 100;
                        village.isProtected = b.is_protected;
                        village.protectionUntil = b.protection_until ? new Date(b.protection_until).getTime() : 0;
                        village.aliancaId = b.jogador?.alianca_id || null;
                    }
                }
            });
        } catch (error) {
            console.error(`[SYNC_ERROR] Failed to fetch map chunk ${cx}:${cy}`, error);
        }
    }

    public postUpdate(deltaTime: number): void {}

    public destroy(): void {}
}

export const worldMapSyncSystem = new WorldMapSyncSystem();
