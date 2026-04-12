import { Component } from '../../core/EntityManager';

export interface Velocity {
  vx: number;
  vy: number;
}

export class VelocityComponent implements Velocity, Component {
  public readonly type = 'Velocity';
  constructor(public vx: number = 0, public vy: number = 0) {}
}