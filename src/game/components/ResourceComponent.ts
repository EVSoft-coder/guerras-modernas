import { Component } from '../../core/EntityManager';

export class ResourceComponent implements Component {
    public readonly type = 'Resource';
    constructor(
        public wood: number = 0,
        public stone: number = 0,
        public iron: number = 0,
        public cap: number = 10000 
    ) {}
}
