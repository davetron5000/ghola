import ColorWheelBase from "./ColorWheelBase"

export default class EqualHueBasedColorWheel extends ColorWheelBase {
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
