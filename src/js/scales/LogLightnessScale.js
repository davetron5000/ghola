
export default class LogLightnessScale {
  constructor(color, numSteps, min_percent = 0.1, la=1, lx=1.5, da=2, dx=2, fudge=0) {
    this.steps = []
    let lightness = color.lightness() / 100
    if (lightness == 0) {
      lightness = 0.01
    }
    else if (lightness == 1) {
      lightness = 0.99
    }
    for (let i = 0; i < numSteps; i++) {
      const previous = this.steps[i-1] / 100
      let percent  = (i+1) / (numSteps)
      if (percent == 0) {
        percent = 0.01
      }
      else if (percent == 1) {
        percent = 0.99
      }

      if (percent < 0.5) {
        percent = la * Math.pow(percent,lx)
        percent = (percent - (percent * fudge))
      }
      else if (percent > 0.5) {
        percent = 1 - ( da * Math.pow(1-percent,dx) )
        percent = (percent + ((1-percent) * fudge))
      }
      if (percent < min_percent) {
        if (i == 0) {
          percent = 0.1
        }
        else if (i == 1) {
          percent = 0.13
        }
      }
      if (!isNaN(previous) && (lightness > previous) && (lightness < percent)) {
        this.steps.push( lightness * 100)
      }
      else {
        this.steps.push( percent * 100 )
      }
      if ( i > 0 ) {
        if (this.steps[i] < this.steps[i-1]) {
          const p = (i+1) / numSteps
          throw `WTF: ${i} ${p} 1 - ( ${da} * Math.pow(1-${p},${dx}) ) ${this.steps}`
        }
      }
    }
  }
}
