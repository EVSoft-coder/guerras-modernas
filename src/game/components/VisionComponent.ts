/**
 * src/game/components/VisionComponent.ts
 * Define o alcance de visibilidade de uma entidade no grid tÃ¡ctico.
 */
import { Component } from '../../core/EntityManager';

export class VisionComponent implements Component {
    public readonly type = 'Vision';

    constructor(
        public range: number = 3 // Alcance em tiles
    ) {}
}
