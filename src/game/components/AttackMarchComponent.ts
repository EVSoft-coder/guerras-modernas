/**
 * src/game/components/AttackMarchComponent.ts
 * Contentor de Dados para OperaÃ§Ãµes de Assalto Trans-Sectoriais.
 */
import { Component } from '../../core/EntityManager';

export type MarchState = 'GOING' | 'ARRIVED' | 'RETURNING';

export class AttackMarchComponent implements Component {
    public readonly type = 'AttackMarch';

    constructor(
        public originId: number,
        public targetX: number,
        public targetY: number,
        public troops: Record<string, number>,
        public totalTime: number,
        public remainingTime: number,
        public state: MarchState = 'GOING',
        public loot: Record<string, number> = { wood: 0, stone: 0, iron: 0 }
    ) {}
}
