import { Component } from '../../core/EntityManager';

export class MarchComponent implements Component {
    public readonly type = 'March';

    constructor(
        public id: string,
        public originX: number,
        public originY: number,
        public targetX: number,
        public targetY: number,
        public units: Record<string, number>,
        public startTime: number,
        public arrivalTime: number,
        public returnTime: number,
        public status: "going" | "returning" | "completed",
        public loot: Record<string, number> = {}
    ) {}
}
