import Color         from "./Color"
import ColorCategory from "./ColorCategory"

class ColorWheelBase {
  static normalizeNumColors(numColors) {
    if (numColors <= 6) {
      return 6
    }
    else {
      return 12
    }
  }
  constructor({numColors,baseColors}) {
    this.numColors = this.constructor.normalizeNumColors(numColors)
    this.baseColor = baseColors[0]
    this.gray = this.baseColor.gray()
    this.colors = []
  }

  eachColor(f) {
    this.colors.forEach(f)
    f(this.gray)
  }
}

class NuancedHueBasedColorWheel extends ColorWheelBase {
  constructor({numColors,baseColors}) {
    super({numColors,baseColors})
    const hue = this.baseColor.hue()
    const map = numColors == 6 ? ColorCategory.sixColorMap : ColorCategory.twelveColorMap
    const [ baseColorName, range ] = map.find( ([name,range]) => {
      if (range.isWithin(hue)) {
        return [ name, range ]
      }
    })
    if (!baseColorName) {
      throw `WTF: ${baseColor} with ${hue} isn't in any range?!??!`
    }
    const percent = range.percent(hue)
    this.colors = map.filter( ([color, range]) => {
      if (color == "red2") {
        return false
      }
      if (baseColorName == color) {
        return false
      }
      else if (baseColorName == "red2" && color == "red") {
        return false
      }
      return true
    }).map( ([color, range]) => {
      const thisHue = range.valueAtPercent(percent)
      return this.baseColor.atHue(thisHue)
    })
    this.colors.unshift(this.baseColor)
  }
}

class EqualHueBasedColorWheel extends ColorWheelBase {
  constructor({numColors,baseColors}) {
    super({numColors,baseColors})
    this.colors = [ this.baseColor ]
    const degrees = 360 / numColors

    let added = false
    for(let i = 1; i < numColors; i++) {
      let newColor = this.colors[this.colors.length - 1].rotateHue(degrees)
      this.colors.push(newColor)
    }
  }
}

export default class ColorWheel extends ColorWheelBase {
  static wheel(name) {
    if (name == "EqualHueBased") {
      return EqualHueBasedColorWheel
    }
    if (name == "NuancedHueBased") {
      return NuancedHueBasedColorWheel
    }
    else {
      throw `No such wheel ${name}`
    }
  }

}

