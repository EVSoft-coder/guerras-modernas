import { Component } from '../../core/EntityManager';

export class MarchComponent implements Component {
    public readonly type = 'March';

    constructor(
        public origin: { x: number; y: number },
        public target: { x: number; y: number },
        public units: Record<string, number>,
        public startTime: number,
        public arrivalTime: number
    ) {}
}
