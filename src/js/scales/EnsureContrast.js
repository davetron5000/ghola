import Color          from "../Color"
import ColorScaleBase from "./ColorScaleBase"

export default class EnsureContrast extends ColorScaleBase {

  findContrast(color1,color2,contrast,delta) {
    let newColor = color1
    while (newColor.contrast(color2) < contrast) {
      const next = delta < 1 ? newColor.darken() : newColor.lighten()
      if (next.lightness() > 99) { break }
      if (next.lightness() < 1) { break }
      newColor = next
    }
    if (Math.abs(newColor.lightness() - color1.lightness()) < 10) {
      return null
    }
    return newColor
  }

  findContrastingPair(dark,light,ratio) {
    while(dark.contrast(light) < ratio) {

      const newDarkest  = dark.withLightness(dark.lightness() - 1, { outOfRange: [ 0, 100 ] })
      const newLightest = light.withLightness(light.lightness() + 1, { outOfRange: [ 0, 100 ] })

      if (newDarkest.lightness() > 0) {
        dark = newDarkest
      }
      if (newLightest.lightness() < 100) {
        light = newLightest
      }
      if ( (newLightest.lightness() >= 100) && (newDarkest.lightness() <= 0) ) {
        break
      }
    }
    return [ dark, light ]
  }

  constructor(color, numShades) {
    super(color, numShades)

    let darker = [
      this.findContrast(this.color,Color.white(),4.5,-1),
    ].filter( (x) => !!x )

    let lighter = [
      this.findContrast(this.color,Color.black(),4.5,1),
    ].filter( (x) => !!x )


    let [ d1, l1 ] = this.findContrastingPair(
      darker[0] || this.color,
      lighter[lighter.length-1] || this.color,
      9,
    )

    darker.unshift(d1)
    lighter.push(l1)

    let [ d2, l2 ] = this.findContrastingPair(
      darker[0] || this.color,
      lighter[lighter.length-1] || this.color,
      13,
    )

    darker.unshift(d2)
    lighter.push(l2)

    const half = Math.floor(numShades/2)

    while (darker.length < half) {
      const color = darker[0] || this.color
      darker.unshift(color.withLightness(color.lightness() / 2, { outOfRange: [ 0,100 ] }))
    }
    while (lighter.length < half) {
      const color = lighter[lighter.length-1] || this.color
      lighter.push(color.withLightness(color.lightness() * 1.2, { outOfRange: [ 0,100 ] }))
    }

    if (darker.length > half) { darker = darker.slice(0,half) }
    if (lighter.length > half) { lighter = lighter.slice(-half) }

    this.shades = darker.concat([color]).concat(lighter).filter( (x) => !!x )
  }
}
