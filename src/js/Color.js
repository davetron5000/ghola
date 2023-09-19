import { GetColorName } from "hex-color-to-color-name"
import chroma           from "chroma-js"

import ColorCategory from "./ColorCategory"

class LabAverage {
  constructor(colors) {
    let l = 0, a = 0, b = 0
    colors.forEach( (color) => {
      const [cl,ca,cb] = color.chroma().lab()
      l += cl
      a += ca
      b += cb
    })
    this.averageColor = new Color(chroma.lab(l,a,b).hex())
  }

  get color() { return this.averageColor }
}

class HSLAverage {
  constructor(colors) {
    let h = 0, s = 0, l = 0
    colors.forEach( (color) => {
      const [ch,cs,cl] = color.chroma().hsl()
      h += ch
      s += cs
      l += cl
    })
    this.averageColor = new Color(chroma.hsl(h,s,l).hex())
  }

  get color() { return this.averageColor }
}

export default class Color {

  static white() { return new Color("#ffffff") }
  static black() { return new Color("#000000") }

  static average(colors,{ model = "lab" } = {}) {
    if (model == "lab") {
      return (new LabAverage(colors)).color
    }
    else if (model == "hsl") {
      return (new HSLAverage(colors)).color
    }
    throw `Unsupported model ${model}`
  }

  constructor(hexCode) {
    this.hexCode = hexCode.toLowerCase()
  }

  // Queries
  chroma()   { return chroma(this.hex()) }
  hex()      { return this.hexCode }
  name()     { return GetColorName(this.hexCode) }
  category() { return new ColorCategory(this) }
  hue()      { return this.chroma().hsl()[0] }
  isGray()   { return isNaN(this.hue()) }

  lightness({ model = "lab" } = {}) {
    if (model == "lab") {
      const [l,a,b] = this.chroma().lab()
      return l
    }
    else if (model == "hsl") {
      const [h,s,l] = this.chroma().hsl()
      return l
    }
    else {
      throw `Unknown model: '${model}'`
    }
  }

  contrast(other) { return chroma.contrast(this.hex(),other.hex()) }

  // Transformations
  lighten(x=1) { return new Color(this.chroma().brighten(x).hex()) }
  darken(x=1)  { return new Color(this.chroma().darken(x).hex()) }

  withLightness(lightness, { model = "lab", outOfRange = "throw" } = {}) {
    lightness = this._checkLightness(lightness, outOfRange)
    if (model == "lab") {
      const [l,a,b] = this.chroma().lab()

      return new Color(
        chroma.lab(lightness,a,b).hex()
      )
    }
    else if (model == "hsl") {
      const [h,s,l] = this.chroma().hsl()
      return new Color(
        chroma.hsl(h,s,lightness / 100).hex()
      )
    }
    else {
      throw `Unknown model: '${model}'`
    }
  }
  atHue(hue) {
    const hsl = this.chroma().hsl()
    if (isNaN(hsl[0])) {
      return this
    }
    else {
      return new Color( chroma.hsl(hue,hsl[1],hsl[2]).hex() )
    }
  }

  gray() { return new Color(this.chroma().desaturate(10).hex()) }

  rotateHue(degrees) {
    const hsl = this.chroma().hsl()
    if (isNaN(hsl[0])) {
      return this
    }
    else {
      const hue = (hsl[0] + degrees) % 360
      return new Color( chroma.hsl(hue,hsl[1],hsl[2]).hex() )
    }
  }

  _checkLightness(lightness, outOfRange) {
    if ( lightness < 0 || lightness > 100 ) {
      if (outOfRange === "throw") {
        throw `Lightness of ${lightness} is outside range 0,100`
      }
      else if (Array.isArray(outOfRange)) {
        if (outOfRange.length != 2) {
          throw `when outOfRange is an array, it must have exactly two items, not ${outOfRange.length}`
        }
        const min = outOfRange[0]
        const max = outOfRange[1]
        return Math.max(min,Math.min(max,lightness))
      }
      else {
        throw `Value for outOfRange is not supported: '${outOfRange}'`
      }
    }
    return lightness
  }
}