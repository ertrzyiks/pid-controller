
export interface PIDTune {
  p: number,
  i: number,
  d: number
}

export class Controller {
  private previousError: number = 0
  private integral: number = 0
  private targetValue: number
  private tune: PIDTune

  constructor(tune: PIDTune, initialTargetValue: number = 0) {
    this.tune = tune
    this.targetValue = initialTargetValue
  }

  setTarget(targetValue: number) {
    this.targetValue = targetValue
  }

  update(currentValue: number, dt: number) {
    const error = this.targetValue - currentValue
    this.integral = this.integral + error * dt

    const derivative = (error - this.previousError) / dt
    this.previousError = error

    const Pout = error * this.tune.p
    const Iout = this.integral * this.tune.i
    const Dout = derivative * this.tune.d

    return Pout + Iout + Dout
  }
}
