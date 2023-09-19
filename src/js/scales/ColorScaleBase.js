import { TypeOf } from "brutaldom"

import Color from "../Color"

export default class ColorScaleBase {
  static normalizeNumShades(numShades) {
    if (numShades <= 5) {
      return 5
    }
    else {
      return 7
    }
  }
  constructor(color, numShades) {
    this.numShades = this.constructor.normalizeNumShades(numShades)
    this.color = color
  }

  colors() {
    if (Array.isArray(this.shades)) {
      return this.shades
    }
    else {
      throw `${TypeOf.asString(this)} didn't provide this.shades as an array: ${TypeOf.asString(this.shades)}`
    }
  }

  comparisonColors(color) {
    const index = this.shades.indexOf(color)
    if (index == -1) {
      throw `You may not get a comparison for a color not in the scale`
    }
    const comparison = [
      Color.black(),
      Color.white(),
    ]
    const middle = this.shades.length / 2
    if (index < middle) {
      comparison.push(this.shades[this.shades.length - 1])
    }
    else {
      comparison.push(this.shades[0])
    }
    return comparison
  }
}
