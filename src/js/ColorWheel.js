import Color         from "./Color"
import ColorCategory from "./ColorCategory"
import NumericRange from "./NumericRange"

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

class HandCraftedWheel {
  constructor(baseColor,numColors) {
    this.baseColor = baseColor
    const hue = baseColor.hue()
    const map = numColors == 6 ? ColorCategory.sixColorMap : ColorCategory.twelveColorMap

    const [ baseColorName, range ] = map.find( ([name,range]) => {
      if (range.isWithin(hue)) {
        return [ name, range ]
      }
    })
    if (!baseColorName) {
      throw `WTF: ${baseColor} with ${hue} isn't in any range?!??!`
    }
    this.baseColorName = baseColorName

    const percent = range.percent(hue)
    this.colors = map.filter( ([color, range]) => {
      if (color == "red2") {
        return false
      }
      if (this.baseColorName == color) {
        return false
      }
      else if (this.baseColorName == "red2" && color == "red") {
        return false
      }
      return true
    }).map( ([color, range]) => {
      const thisHue = range.valueAtPercent(percent)
      return [ color, baseColor.atHue(thisHue) ]
    })
    this.colors.unshift([ this.baseColorName, this.baseColor ])
  }

  colorsNamed(name) {
    const colors = this.colors.filter( ([colorName, color]) => {
      return name == colorName
    }).map( ([colorName, color]) => color )
    if (colors.indexOf(this.baseColor) != -1) {
      return [ this.baseColor ]
    }
    else {
      return colors
    }
  }
  baseColorNamed(name) {
    if (this.baseColorName == name) {
      return this.baseColor
    }
    else {
      return null
    }
  }
}
class NuancedHueBasedColorWheel extends ColorWheelBase {
  constructor({numColors,baseColors}) {
    super({numColors,baseColors})
    const map = (numColors == 6 ? ColorCategory.sixColorMap : ColorCategory.twelveColorMap).filter( ([color]) => color != "red2" )
    const wheels = this.baseColors.map( (color) => new HandCraftedWheel(color,numColors) )
    const averageColor = Color.average(this.baseColors, {model: "hsl"})

    this.colors = map.map( ([colorName, range]) => {
      const matching = wheels.map( (wheel) => wheel.colorsNamed(colorName) ).flat()
      const originalBase = wheels.map( (wheel) => wheel.baseColorNamed(colorName) ).filter( (x) => !!x )

      if (matching.length > 0) {
        const toAverage = originalBase.length == 0 ? matching : originalBase
        return Color.average(toAverage, {model: "hsl"})
      }
      else {
        return averageColor.atHue(range.valueAtPercent(.50))
      }
    })
  }
}

class EqualHueBasedColorWheel extends ColorWheelBase {
  constructor({numColors,baseColors}) {
    super({numColors,baseColors})
    const numColorsNeeded = numColors - this.baseColors.length
    const numVariations = numColorsNeeded / this.baseColors.length
    const degreesPerVariation = 360 / numColors
    this.colors = this.baseColors.map( (color) => {
      const list = []
      for(let i=0;i<numVariations+1;i++) {
        list.push(color.rotateHue(i * degreesPerVariation))
      }
      return list
    }).flat().sort( (a,b) => a.hue() - b.hue() )
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

