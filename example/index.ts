import { Controller } from '../src'

const controller = new Controller({p: 0.25, i: 0.1, d: 1})

controller.setTarget(100)

setInterval(() => {
  const newTarget = 100 * Math.random()
  console.log('New Target', newTarget)
  controller.setTarget(newTarget)
}, 5000)

let value = 0

function tick() {
  const time = 160

  // for (let i = 0; i < 100; i++) {
    const input = controller.update(value, time)
    value += input
  // }

  console.log(value)

  setTimeout(tick, time)
}

tick()
