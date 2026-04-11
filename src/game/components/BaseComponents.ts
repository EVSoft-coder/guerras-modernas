/**
 * src/game/components/BaseComponents.ts
 * Assinatura de Componentes (Fase 5 - EXPANSÃO).
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
 
/**
 * AttackComponent: Poder de fogo e raio de ação.
 */
export class AttackComponent implements Component {
    public type = 'Attack';
    constructor(
        public power: number = 10,
        public range: number = 50,
        public cooldown: number = 1, // Segundos entre ataques
        public lastAttack: number = 0
    ) {}
}
 
/**
 * AIComponent: Marcar Entidade como Autónoma.
 */
export class AIComponent implements Component {
    public type = 'AI';
    constructor(public behavior: 'AGGRESSIVE' | 'PATROL' = 'AGGRESSIVE') {}
}
