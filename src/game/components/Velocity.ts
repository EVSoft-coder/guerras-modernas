/**
 * src/game/components/Velocity.ts
 * Componente de Vector de Movimento (Puro Dado).
 */
import { Component } from '../../core/EntityManager';
 
export class Velocity implements Component {
    public readonly type = 'Velocity';
 
    constructor(
        public dx: number = 0,
        public dy: number = 0
    ) {}
}
