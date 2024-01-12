import BaseDerivation from "./BaseDerivation"

export default class BrightnessDerivation extends BaseDerivation {
  derive(hexCode, options={}) {
    if (options.darken && !isNaN(options.darken)) {
      return this.darken(hexCode,options.darken)
    }
    else if (options.brighten && !isNaN(options.brighten)) {
      return this.brighten(hexCode,options.brighten)
    }
    else {
      return hexCode
    }
  }

  darken(hexCode,darken) {
    const [h,s,l] = this.hsl(hexCode)

    const distance = l
    const percent = darken / 100
    const decrease = distance * percent
    const newL = l - decrease
    return this.hexCode(h,s,newL)
  }

  brighten(hexCode,brighten) {
    const [h,s,l] = this.hsl(hexCode)

    const distance = 100 - l
    const percent = brighten / 100
    const increase = distance * percent
    const newL = l + increase
    return this.hexCode(h,s,newL)
  }
}
