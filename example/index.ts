import { DynamicTerminal } from 'dynamic-terminal'
import { Controller } from '../src'

const dt = new DynamicTerminal()


const controller = new Controller({p: 0.85, i: 0.001, d: 0.001})

class Car {
  private velocity: number = 0
  private acceleration: number = 0
  private drag: number = 0

  setPower(power: number) {
    const MAX_POWER = 30
    const MIN_POWER = -20

    const newPower = Math.max(MIN_POWER, Math.min(power, MAX_POWER))

    // Assume engine power generates some acceleration or deceleration
    this.acceleration = newPower

    return newPower === power
  }

  // Extra force applied to the car
  // Positive number causes deceleration - simulate going uphill
  // Negative number causes acceleration - simulate going downhill
  setDrag(drag: number) {
    this.drag = drag
  }

  getDrag() {
    return this.drag
  }

  getVelocity() {
    return this.velocity
  }

  update(dt: number) {
    this.velocity += (this.acceleration - this.drag) * dt
  }
}

let car = new Car()

let lastTime = process.hrtime()

function tick() {
  const targetVelocity = 100

  const now = process.hrtime(lastTime)
  const elapsedTimeInMs = now[0] * 1000 + Math.round(now[1] / 1000000)

  let power = controller.update(car.getVelocity(), targetVelocity, elapsedTimeInMs)

  const success = car.setPower(power)
  controller.setSaturating(!success)

  car.update(elapsedTimeInMs / 1000)

  dt.update([
    { text: `Target velocity: ${targetVelocity}`, indent: 2 },
    { text: `Current drag: ${car.getDrag()}`, indent: 2 },
    { text: `Current velocity: ${car.getVelocity()}`, indent: 2 }
  ]);

  lastTime = process.hrtime()
  setTimeout(tick, 100)
}

async function start() {
  if ((await dt.start({updateFrequency: 1000})) === false) console.error(dt.lastError)

  // Generate random hills
  setInterval(() => {
    car.setDrag(Math.round(40 * Math.random()) - 20)
  }, 10000)

  tick()
}

start()

process.on('SIGTERM', function () {
  if (!dt.destroy()) process.exit()
})
