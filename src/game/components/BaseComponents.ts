/**
 * src/game/components/BaseComponents.ts
 * Assinatura de Componentes (Fase 6 - ORDENS E SELECÇÃO).
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
 
export class SpriteComponent implements Component {
    public type = 'Sprite';
    constructor(public imagePath: string) {}
}
 
export class AttackComponent implements Component {
    public type = 'Attack';
    constructor(
        public power: number = 10,
        public range: number = 50,
        public cooldown: number = 1,
        public lastAttack: number = 0
    ) {}
}
 
export class AIComponent implements Component {
    public type = 'AI';
    constructor(public behavior: 'AGGRESSIVE' | 'PATROL' = 'AGGRESSIVE') {}
}
 
/**
 * TargetComponent: Coordenadas de destino para manobras.
 */
export class TargetComponent implements Component {
    public type = 'Target';
    constructor(public x: number, public y: number) {}
}
 
/**
 * SelectionComponent: Marca a unidade como selecionada pelo jogador.
 */
export class SelectionComponent implements Component {
    public type = 'Selection';
    constructor(public isSelected: boolean = true) {}
}
