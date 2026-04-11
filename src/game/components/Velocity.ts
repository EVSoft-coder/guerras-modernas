export interface Velocity {
  vx: number;
  vy: number;
}

export class VelocityComponent implements Velocity {
  public readonly type = 'Velocity';
  constructor(public vx: number = 0, public vy: number = 0) {}
}