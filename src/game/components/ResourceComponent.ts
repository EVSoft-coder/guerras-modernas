import { Component } from '../../core/EntityManager';

export class ResourceComponent implements Component {
    public readonly type = 'Resource';
    constructor(
        public suprimentos: number = 0,
        public combustivel: number = 0,
        public municoes: number = 0,
        public metal: number = 0,
        public energia: number = 0,
        public pessoal: number = 0,
        public cap: number = 10000 
    ) {}
}
