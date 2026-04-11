import { Component } from '../../core/EntityManager';

export class BuildingComponent implements Component {
    public readonly type = 'Building';
    constructor(
        public name: string,
        public level: number,
        public villageId: number // Referência à entidade Village (Player)
    ) {}
}
