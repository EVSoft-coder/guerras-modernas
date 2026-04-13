import { Component } from '../../core/EntityManager';

export interface VillageResources {
    suprimentos: number;
    combustivel: number;
    municoes: number;
    pessoal: number;
}

export class VillageComponent implements Component {
    public readonly type = 'Village';
    public ownerId: number | null;

    constructor(
        ownerId: number | null,
        public level: number = 1,
        public resources: VillageResources = { 
            suprimentos: 0, 
            combustivel: 0, 
            municoes: 0, 
            pessoal: 0
        },
        public name: string = 'Base_Outpost',
        public isRebel: boolean = false,
        public loyalty: number = 100,
        public isProtected: boolean = false,
        public protectionUntil: number = 0
    ) {
        // Regra: isRebel = true -> ownerId = null
        this.ownerId = isRebel ? null : ownerId;
    }
}
