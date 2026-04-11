import { Component } from '../../core/EntityManager';

export class VillageComponent implements Component {
    public readonly type = 'Village';
    constructor(
        public name: string
    ) {}
}
