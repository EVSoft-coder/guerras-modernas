/**
 * src/game/components/ProductionComponent.ts
 * Define a capacidade de geraÃ§Ã£o de recursos de uma entidade.
 */
import { Component } from '../../core/EntityManager';

export type ProductionResource = 'suprimentos' | 'combustivel' | 'municoes' | 'metal' | 'energia' | 'pessoal' | 'all';

export class ProductionComponent implements Component {
    public readonly type = 'Production';

    constructor(
        public resourceType: ProductionResource,
        public ratePerSecond: number = 1
    ) {}
}
