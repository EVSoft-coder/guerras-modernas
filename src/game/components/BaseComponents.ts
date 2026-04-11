/**
 * src/game/components/BaseComponents.ts
 * Assinatura de Componentes (Dados Puros).
 */
import { Component } from '../../core/EntityManager';
 
export class PositionComponent implements Component {
    public type = 'Position';
    constructor(public x: number = 0, public y: number = 0) {}
}
 
export class VelocityComponent implements Component {
    public type = 'Velocity';
    constructor(public vx: number = 0, public vy: number = 0) {}
}
 
export class HealthComponent implements Component {
    public type = 'Health';
    constructor(public value: number = 100, public max: number = 100) {}
}
