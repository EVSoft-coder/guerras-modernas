/**
 * src/game/components/Position.ts
 * Componente de Posicionamento Espacial (Puro Dado).
 */
import { Component } from '../../core/EntityManager';
 
export class Position implements Component {
    public readonly type = 'Position';
    
    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}
}
