/**
 * src/game/components/ArmyComponent.ts
 * RepresentaÃ§Ã£o de uma ForÃ§a Militar em trÃ¢nsito ou guarniÃ§Ã£o.
 */
import { Component } from '../../core/EntityManager';

export class ArmyComponent implements Component {
    public readonly type = 'Army';

    constructor(
        public ownerId: number,
        public units: Record<string, number> = {},
        public targetId?: number,
        public loot: Record<string, number> = { wood: 0, stone: 0, iron: 0 }
    ) {}
}
