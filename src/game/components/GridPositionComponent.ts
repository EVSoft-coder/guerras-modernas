import { Component } from '../../core/EntityManager';

export interface GridPositionComponent extends Component {
    type: 'GridPosition';
    x: number;
    y: number;
}
