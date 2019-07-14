
export interface PIDTune {
  p: number,
  i: number,
  d: number
}

export class Controller {
  private previousError: number = 0
  private integral: number = 0
  private ignoreIntegral: boolean = false
  private isSaturating: boolean = false

  private tune: PIDTune

  constructor(tune: PIDTune) {
    this.tune = tune
  }

  setSaturating(isSaturating: boolean) {
    this.isSaturating = isSaturating
  }

  update(currentValue: number, targetValue: number, dt: number) {
    const error = targetValue - currentValue
    if (!this.ignoreIntegral) {
      this.integral = this.integral + error * dt
    }

    const derivative = (error - this.previousError) / dt
    this.previousError = error

    const Pout = error * this.tune.p
    const Iout = this.integral * this.tune.i
    const Dout = derivative * this.tune.d

    const output = Pout + Iout + Dout

    this.ignoreIntegral = this.isSaturating && (output > 0) === (this.integral > 0)
    return output
  }
}
