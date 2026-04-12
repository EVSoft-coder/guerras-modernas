/**
 * src/game/components/GridPositionComponent.ts
 * Sistema de Coordenadas Orbitais.
 */
import { Component } from '../../core/EntityManager';

export class GridPositionComponent implements Component {
    public readonly type = 'GridPosition';

    constructor(
        public x: number = 0,
        public y: number = 0,
        public isVisible: boolean = true
    ) {}
}
