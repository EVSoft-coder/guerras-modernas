/**
 * src/game/components/TileComponent.ts
 * RepresentaÃ§Ã£o de um Setor de Terreno no Grid Global.
 */
import { Component } from '../../core/EntityManager';

export type TileType = 'grass' | 'desert' | 'water' | 'mountain' | 'village' | 'resource' | 'obstacle';

export class TileComponent implements Component {
    public readonly type = 'Tile';

    constructor(
        public x: number,
        public y: number,
        public tileType: TileType = 'grass'
    ) {}
}
