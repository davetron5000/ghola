import Color from "../Color"

export default class ColorWheelBase {
  static normalizeNumColors(numColors) {
    if ( (numColors > 0) && (numColors < 3) ) {
      return numColors
    }
    else if (numColors <= 6) {
      return 6
    }
    else {
      return 12
    }
  }
  constructor({numColors,baseColors}) {
    this.numColors = this.constructor.normalizeNumColors(numColors)
    this.baseColors = baseColors.filter( (x) => !!x )
    if (this.baseColors.length == 0) {
      throw `You must provide at least one color`
    }
    this.baseColor = this.baseColors[0]
    this.gray = Color.average(this.baseColors).gray()
    this.colors = []
  }

  eachColor(f) {
    this.colors.forEach(f)
    f(this.gray)
  }
}
