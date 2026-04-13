import { Component } from '../../core/EntityManager';

export interface Position {
  x: number;
  y: number;
}

export class PositionComponent implements Position, Component {
  public readonly type = 'Position';
  constructor(public x: number = 0, public y: number = 0) {}
}
