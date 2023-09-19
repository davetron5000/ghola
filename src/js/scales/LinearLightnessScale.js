export default class LinearLightnessScale {
  constructor(color, numSteps, discard=1) {
    const numScale = numSteps + (2 * discard)
    this.steps = []
    let lightness = color.lightness() / 100
    if (lightness == 0) {
      lightness = 0.01
    }
    else if (lightness == 1) {
      lightness = 0.99
    }
    for (let i = 0; i < numScale; i++) {
      const previous = i-1 / (numScale-1)
      let percent  = i   / (numScale-1)
      if (percent == 0) {
        percent = 0.01
      }
      else if (percent == 1) {
        percent = 0.99
      }
      if ((lightness > previous) && (lightness < percent)) {
        this.steps.push( lightness * 100)
      }
      else {
        this.steps.push( percent * 100)
      }
    }
    this.steps = this.steps.slice(discard,numSteps+discard)
  }
}
