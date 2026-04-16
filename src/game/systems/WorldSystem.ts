/**
 * src/game/systems/WorldSystem.ts
 * Gestor de Geografia TÃ¡ctica e PersistÃªncia de Terreno.
 */
import { entityManager } from '../../core/EntityManager';
import { GameSystem } from './types';
import { TileComponent } from '../components/TileComponent';

export class WorldSystem implements GameSystem {
    public readonly WORLD_SIZE = 100; // Grid 100x100
    private chunkLoaded: Set<string> = new Set();

    public init(): void {
        console.log(`[SYSTEM] WorldSystem - Global Grid Initialized (${this.WORLD_SIZE}x${this.WORLD_SIZE}).`);
        
        // Inicializar tiles Críticos (Vilas Iniciais por exemplo)
        this.generateEssentialSectors();
    }

    private generateEssentialSectors(): void {
        // Criar biomas iniciais baseados em geografia determinística
        for (let y = 0; y < this.WORLD_SIZE; y++) {
            for (let x = 0; x < this.WORLD_SIZE; x++) {
                const biome = this.getBiomeAt(x, y);
                this.createTile(x, y, biome);
            }
        }

        // Adicionar recursos estrategicamente
        this.createTile(50, 50, 'resource');
        this.createTile(52, 52, 'resource');
    }

    private getBiomeAt(x: number, y: number): TileType {
        // O Mar envolve o mundo (Bordas)
        if (y < 5 || y > 94 || x < 5 || x > 94) return 'water';
        
        // Pseudo-Noise determinístico para biomas
        const noise = (Math.sin(x * 0.12) + Math.cos(y * 0.15) + Math.sin(x * 0.3 + y * 0.2)) / 3;
        
        if (noise > 0.5) return 'mountain';
        if (noise < -0.4) return 'desert';
        if (noise < -0.6) return 'water'; // Pequenos lagos internos

        return 'grass';
    }

    public createTile(x: number, y: number, type: TileType): void {
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
