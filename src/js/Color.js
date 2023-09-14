import { GetColorName } from "hex-color-to-color-name"
import chroma from "chroma-js"

export default class Color {
  constructor(hexCode) {
    this.hexCode = hexCode
  }
  hex() { return this.hexCode }
  name() { try {
    return GetColorName(this.hexCode)
  }
    catch(e) {
      console.log(e)
      console.log('%o',this.hexCode)
      return this.hexCode
    }

  }

  gray() {
    return new Color(chroma(this.hex()).desaturate(10).hex())
  }
  category(simple) {
    return this.name()
  }
  hue() {
    return chroma(this.hex()).hsl()[0]
  }
  hsl() {
    return chroma(this.hex()).hsl().slice(0,3).map( (value) => {
      if (isNaN(value)) {
        return "NaN"
      }
      return Math.ceil(value * 100) / 100
    }).join()
  }

  darkest() {
    const hsl = chroma(this.hex()).hsl()
    //return new Color(chroma.hsl(hsl[0],hsl[1],Math.max(0.05,hsl[2]/4)).hex())
    return new Color(chroma.hsl(hsl[0],hsl[1],0.1).hex())
  }
  dark() {
    const hsl = chroma(this.hex()).hsl()
    //return new Color(chroma.hsl(hsl[0],hsl[1],Math.max(0.1,(hsl[2]/2))).hex())
    return new Color(chroma.hsl(hsl[0],hsl[1],0.15).hex())
  }
  lightest() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],0.9).hex())
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.min(0.95,hsl[2] * 4)).hex())
  }
  light() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],0.85).hex())
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.min(0.9,(hsl[2] * 2))).hex())
  }

  darken(amount) {
    const lab = chroma(this.hex()).lab()
    return new Color(chroma.lab(Math.max(lab[0] - amount,0),lab[1],lab[2]).hex())
  }
  lighten(amount) {
    const lab = chroma(this.hex()).lab()
    return new Color(chroma.lab(Math.min(lab[0] + amount,100),lab[1],lab[2]).hex())
  }

  contrast(other) {
    return chroma.contrast(this.hex(),other.hex())
  }

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
