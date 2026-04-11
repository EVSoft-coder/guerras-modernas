import { Component } from '../../core/EntityManager';

export class BuildingComponent implements Component {
    public readonly type = 'Building';
    constructor(
        public name: string,
        public buildingType: string,
        public level: number,
        public position: { x: number; y: number },
        public villageId: number
    ) {}
}
