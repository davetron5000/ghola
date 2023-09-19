import Color          from "../Color"
import ColorCategory  from "../ColorCategory"
import ColorWheelBase from "./ColorWheelBase"

class SingleColorHandCraftedWheel {
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
export default class HandCraftedWheel extends ColorWheelBase {
  constructor({numColors,baseColors}) {
    super({numColors,baseColors})
    const map = (numColors == 6 ? ColorCategory.sixColorMap : ColorCategory.twelveColorMap).filter( ([color]) => color != "red2" )
    const wheels = this.baseColors.map( (color) => new SingleColorHandCraftedWheel(color,numColors) )
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
