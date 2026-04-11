/**
 * src/game/components/BaseComponents.ts
 * Definição de componentes (Dados Puros).
 */
 
export class PositionComponent {
    constructor(public x: number = 0, public y: number = 0) {}
}
 
export class VelocityComponent {
    constructor(public vx: number = 0, public vy: number = 0) {}
}
 
export class HealthComponent {
    constructor(public value: number = 100, public max: number = 100) {}
}
