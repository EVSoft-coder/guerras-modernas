/**
 * src/game/systems/WorldSystem.ts
 * Gestor de Geografia TÃ¡ctica e PersistÃªncia de Terreno.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { TileComponent } from '../components/TileComponent';

export class WorldSystem implements GameSystem {
    public readonly WORLD_SIZE = 1000; // Grid 1000x1000
    private chunkLoaded: Set<string> = new Set();

    public init(): void {
        console.log(`[SYSTEM] WorldSystem - Global Grid Initialized (${this.WORLD_SIZE}x${this.WORLD_SIZE}).`);
        
        // Inicializar tiles CrÃ­ticos (Vilas Iniciais por exemplo)
        this.generateEssentialSectors();
    }

    private generateEssentialSectors(): void {
        // Exemplo: Criar um setor de recursos na origem
        this.createTile(500, 500, 'village');
        this.createTile(505, 505, 'resource');
    }

    public createTile(x: number, y: number, type: any): void {
        const key = `${x}:${y}`;
        if (this.chunkLoaded.has(key)) return;

        const tileEntity = entityManager.createEntity();
        entityManager.addComponent(tileEntity, new TileComponent(x, y, type));
        this.chunkLoaded.add(key);
    }

    public preUpdate(deltaTime: number): void {}
    public update(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] WorldSystem - Geography Halted.');
    }
}

export const worldSystem = new WorldSystem();
