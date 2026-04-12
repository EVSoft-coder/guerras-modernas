import { Component } from '../../core/EntityManager';

export type UnitCategory = "infantry" | "tank" | "drone";

export class UnitComponent implements Component {
    public readonly type = 'Unit';
    
    constructor(
        public unitCategory: UnitCategory,
        public attack: number,
        public defense: number,
        public speed: number,
        public capacity: number,
        public intelRange: number = 2,
        public attackBonus: number = 1.0,
        public speedBonus: number = 1.0
    ) {}
}
