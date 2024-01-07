import BaseDerivation from "./BaseDerivation"
import chroma from "chroma-js"

export default class LinearDerivation extends BaseDerivation {
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
    const chromaColor = chroma(hexCode)
    const [h, s, l] = chromaColor.hsl()

    const distance = l
    const percent = darken / 100
    const decrease = distance * percent
    const newL = l - decrease
    return chroma.hsl(h,s,newL).hex()

  }

  brighten(hexCode,brighten) {
    const chromaColor = chroma(hexCode)
    const [h, s, l] = chromaColor.hsl()

    const distance = 1 - l
    const percent = brighten / 100
    const increase = distance * percent
    const newL = l + increase
    return chroma.hsl(h,s,newL).hex()
  }
}
