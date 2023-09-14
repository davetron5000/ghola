export default class ColorWheel {
  static normalizeNumColors(numColors) {
    if (numColors <= 6) {
      return 6
    }
    else {
      return 12
      return 12
    }
  }
  constructor({numColors,baseColors}) {
    this.numColors = this.constructor.normalizeNumColors(numColors)
    this.baseColor = baseColors[0]
    this.gray = this.baseColor.gray()
    this.colors = [ this.baseColor ]
    const degrees = 360 / numColors

    let added = false
    for(let i = 1; i < numColors; i++) {
      let newColor = this.colors[this.colors.length - 1].rotateHue(degrees)
      this.colors.push(newColor)
    }
  }

  eachColor(f) {
    this.colors.forEach(f)
    f(this.gray)
  }
}

