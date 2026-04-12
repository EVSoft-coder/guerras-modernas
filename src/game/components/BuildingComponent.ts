import { Component } from '../../core/EntityManager';

export class BuildingComponent implements Component {
    public readonly type = 'Building';
    constructor(
        public buildingType: string,
        public level: number = 1
    ) {}
}
