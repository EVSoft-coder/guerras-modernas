/**
 * src/game/components/ArmyComponent.ts
 * Representação de uma Força Militar em trânsito ou guarnição com espólio táctico.
 */
import { Component } from '../../core/EntityManager';

export class ArmyComponent implements Component {
    public readonly type = 'Army';

    constructor(
        public ownerId: number,
        public units: Record<string, number> = {},
        public targetId?: number,
        public loot: Record<string, number> = { 
            suprimentos: 0, 
            combustivel: 0, 
            municoes: 0, 
            pessoal: 0, 
            metal: 0, 
            energia: 0 
        }
    ) {}
}
