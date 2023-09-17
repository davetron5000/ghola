import { GetColorName } from "hex-color-to-color-name"
import chroma from "chroma-js"

import ColorCategory from "./ColorCategory"

export default class Color {

  static white() { return new Color("#ffffff") }
  static black() { return new Color("#000000") }

  constructor(hexCode) {
    this.hexCode = hexCode.toLowerCase()
  }
  hex() { return this.hexCode }
  name() { return GetColorName(this.hexCode) }
  category() { 
    return new ColorCategory(this)
  }

  lightness({ model = "lab" } = {}) {
    if (model == "lab") {
      const [l,a,b] = chroma(this.hex()).lab()
      return l
    }
    else {
      throw `Unknown model: '${model}'`
    }
  }

  lighten(x=1) { return new Color(chroma(this.hex()).brighten(x).hex()) }
  darken(x=1) { return new Color(chroma(this.hex()).darken(x).hex()) }

  withLightness(lightness, { model = "lab", outOfRange = "throw" } = {}) {
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
        lightness = Math.max(min,Math.min(max,lightness))
      }
      else {
        throw `Value for outOfRange is not supported: '${outOfRange}'`
      }
    }
    if (model == "lab") {
      const [l,a,b] = chroma(this.hex()).lab()

      return new Color(
        chroma.lab(lightness,a,b).hex()
      )
    }
    else if (model == "hsl") {
      const [h,s,l] = chroma(this.hex()).hsl()
      return new Color(
        chroma.hsl(h,s,lightness / 100).hex()
      )
    }
    else {
      throw `Unknown model: '${model}'`
    }
  }
  contrast(other) { return chroma.contrast(this.hex(),other.hex()) }
  atHue(hue) {
    const hsl = chroma(this.hex()).hsl()
    if (isNaN(hsl[0])) {
      return this
    }
    else {
      return new Color( chroma.hsl(hue,hsl[1],hsl[2]).hex() )
    }
  }

  hue() { return chroma(this.hex()).hsl()[0] }
  isGray() { return isNaN(this.hue()) }
  gray() { return new Color(chroma(this.hex()).desaturate(10).hex()) }

  rotateHue(degrees) {
    const hsl = chroma(this.hex()).hsl()
    if (isNaN(hsl[0])) {
      return this
    }
    else {
      const hue = (hsl[0] + degrees) % 360
      return new Color( chroma.hsl(hue,hsl[1],hsl[2]).hex() )
    }
  }
}
