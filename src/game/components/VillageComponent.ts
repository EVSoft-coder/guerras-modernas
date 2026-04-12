import { Component } from '../../core/EntityManager';

export interface VillageResources {
    suprimentos: number;
    combustivel: number;
    municoes: number;
    pessoal: number;
    metal: number;
    energia: number;
}

export class VillageComponent implements Component {
    public readonly type = 'Village';
    constructor(
        public ownerId: number,
        public level: number = 1,
        public resources: VillageResources = { 
            suprimentos: 0, 
            combustivel: 0, 
            municoes: 0, 
            pessoal: 0, 
            metal: 0, 
            energia: 0 
        },
        public name: string = 'Base_Outpost'
    ) {}
}
