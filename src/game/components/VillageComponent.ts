import { Component } from '../../core/EntityManager';

export class VillageComponent implements Component {
    public readonly type = 'Village';
    constructor(
        public ownerId: number,
        public level: number = 1,
        public resources: { wood: number, stone: number, iron: number } = { wood: 0, stone: 0, iron: 0 },
        public name: string = 'Base_Outpost'
    ) {}
}
