export class ResourceComponent {
    public readonly type = 'Resource';
    constructor(
        public wood: number = 0,
        public stone: number = 0,
        public iron: number = 0
    ) {}
}
