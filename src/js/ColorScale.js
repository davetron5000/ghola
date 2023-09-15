import { TypeOf } from "brutaljs"
import chroma from "chroma-js"

import Color from "./Color"


class ColorScaleBase {
  static normalizeNumShades(numShades) {
    if (numShades <= 5) {
      return 5
    }
    else {
      return 7
    }
  }
  constructor(color, numShades) {
    this.numShades = this.constructor.normalizeNumShades(numShades)
    this.color = color
  }

  colors() {
    if (Array.isArray(this.shades)) {
      return this.shades
    }
    else {
      throw `${TypeOf.asString(this)} didn't provide this.shades as an array: ${TypeOf.asString(this.shades)}`
    }
  }

  comparisonColors(color) {
    const index = this.shades.indexOf(color)
    if (index == -1) {
      throw `You may not get a comparison for a color not in the scale`
    }
    const comparison = [
      new Color("#000000"),
      new Color("#FFFFFF"),
    ]
    const middle = this.shades.length / 2
    if (index < middle) {
      comparison.push(this.shades[this.shades.length - 1])
    }
    else {
      comparison.push(this.shades[0])
    }
    return comparison
  }
}

class FixedHSLLightness extends ColorScaleBase {
  constructor(color, numShades, baseColor) {
    super(color, numShades)
    const lightness = Math.min(95,Math.max(5,baseColor.lightness()))

    let lightnessValues = [];

    const bright = baseColor.lightness() >= 80
    const dark   = baseColor.lightness() <= 20

    if (this.numShades == 5) {
      lightnessValues[0] = Math.min(dark ? 1 : 5,baseColor.lightness())
      lightnessValues[1] = Math.min(dark ? 8 : 15,baseColor.lightness())
      lightnessValues[2] = baseColor.lightness()
      lightnessValues[3] = Math.max(bright? 90 : 80,baseColor.lightness())
      lightnessValues[4] = Math.max(bright? 99 : 97,baseColor.lightness())
    }
    else {
      lightnessValues[0] = Math.min(dark ? 2  : 3, baseColor.lightness())
      lightnessValues[1] = Math.min(dark ? 6  : 13,baseColor.lightness())
      lightnessValues[2] = Math.min(dark ? 15 : 20,baseColor.lightness())
      lightnessValues[3] = baseColor.lightness()
      lightnessValues[4] = Math.max(bright ? 90 : 80,baseColor.lightness())
      lightnessValues[5] = Math.max(bright ? 95 : 87,baseColor.lightness())
      lightnessValues[6] = Math.max(bright ? 99 : 98,baseColor.lightness())
    }
    this.shades = lightnessValues.map( (value) => {
      return this.color.withLightness(value, { model: "hsl" })
    })
  }
}
class FixedLabLightness extends ColorScaleBase {
  constructor(color, numShades, baseColor) {
    super(color, numShades)
    const lightness = Math.min(95,Math.max(5,baseColor.lightness()))

    let lightnessValues = [];

    if (this.numShades == 5) {
      if (baseColor.lightness() <= 20) {
        lightnessValues[0] = color.isGray() ? 1 : 0
        lightnessValues[1] = Math.max(2,baseColor.lightness() / 2)
        lightnessValues[2] = baseColor.lightness()
        lightnessValues[3] = baseColor.lightness() * 4.5
        lightnessValues[4] = color.isGray() ? 99 : 100
      }
      else if (baseColor.lightness() >= 80) {
        lightnessValues[0] = Math.max(baseColor.lightness() / 5,(color.isGray() ? 1 : 0))
        lightnessValues[1] = baseColor.lightness() / 2
        lightnessValues[2] = baseColor.lightness()
        lightnessValues[3] = Math.max(98,baseColor.lightness())
        lightnessValues[4] = color.isGray() ? 99 : 100
      }
      else {
        lightnessValues[0] = color.isGray() ? 1 : 0
        lightnessValues[1] = 2
        lightnessValues[2] = baseColor.lightness()
        lightnessValues[3] = 98
        lightnessValues[4] = color.isGray() ? 99 : 100
      }
    }
    else {
      if (baseColor.lightness() <= 20) {
        lightnessValues[0] = color.isGray() ? 1 : 0
        lightnessValues[1] = Math.max(2,baseColor.lightness() / 2)
        lightnessValues[2] = Math.max(2,baseColor.lightness() / 1.5)
        lightnessValues[3] = baseColor.lightness()
        lightnessValues[4] = baseColor.lightness() * 3
        lightnessValues[5] = baseColor.lightness() * 4.5
        lightnessValues[6] = color.isGray() ? 99 : 100
      }
      else if (baseColor.lightness() >= 80) {
        lightnessValues[0] = Math.max(baseColor.lightness() / 5,(color.isGray() ? 1 : 0))
        lightnessValues[1] = baseColor.lightness() / 2
        lightnessValues[2] = baseColor.lightness() / 1.5
        lightnessValues[3] = baseColor.lightness()
        lightnessValues[4] = Math.max(97,baseColor.lightness())
        lightnessValues[5] = Math.max(98,baseColor.lightness())
        lightnessValues[6] = color.isGray() ? 99 : 100
      }
      else {
        lightnessValues[0] = color.isGray() ? 1 : 0
        lightnessValues[1] = 5
        lightnessValues[2] = Math.max(10,baseColor.lightness() - 20)
        lightnessValues[3] = baseColor.lightness()
        lightnessValues[4] = Math.min(90,baseColor.lightness() + 20)
        lightnessValues[5] = 98
        lightnessValues[6] = color.isGray() ? 99 : 100
      }
    }
    this.shades = lightnessValues.map( (value) => {
      return this.color.withLightness(value, { model: "lab" })
    })
  }
}

class ChromaScale extends ColorScaleBase {
  constructor(color, numShades) {
    super(color, numShades)
    const scale = chroma.scale(["black", color.hex(), "white"])
    const shades = scale.colors(30).slice(1,28).map( (chromaColor) => {
      return new Color(chromaColor)
    })
    this.shades = []
    if (numShades == 5) {
      this.shades[0] = shades[0]
      this.shades[1] = shades[Math.max(Math.ceil(shades.length * .3),4)]
      this.shades[2] = color
      this.shades[3] = shades[Math.ceil(shades.length * .7)]
      this.shades[4] = shades[shades.length-1]
    }
    else {
      this.shades[0] = shades[0]
      this.shades[1] = shades[Math.ceil(shades.length * .2)]
      this.shades[2] = shades[Math.ceil(shades.length * .3)]
      this.shades[3] = color
      this.shades[4] = shades[Math.ceil(shades.length * .7)]
      this.shades[5] = shades[Math.ceil(shades.length * .8)]
      this.shades[6] = shades[shades.length-1]
    }
  }
}

class EnsureContrast extends ColorScaleBase {
  constructor(color, numShades) {
    super(color, numShades)

    let darker = color.withLightness(color.lightness() - 10, { "outOfRange": [ 1, 99 ]})
    let lighter = color.withLightness(color.lightness() + 10, { "outOfRange": [ 1, 99 ]})

    // First, find the nearest colors with contrast for black or white
    while (darker.contrast(Color.white()) < 4.5) {
      const next = darker.withLightness(darker.lightness() - 1, { "outOfRange": [ 1,99 ] })
      if (next.lightness() <= 2) {
        break
      }
      darker = next
    }
    while (lighter.contrast(Color.black()) < 4.5) {
      const next = lighter.withLightness(lighter.lightness() + 1, { "outOfRange": [ 1,99 ] })
      if (next.lightness() >= 98) {
        break
      }
      lighter = next
    }

    // Now, find a dark/light combo that contrasts with itself

    let darkest = darker.withLightness(darker.lightness() - 10, { "outOfRange": [ 1, 99 ]})
    let lightest = lighter.withLightness(lighter.lightness() + 10, { "outOfRange": [ 1, 99 ]})

    while (darkest.contrast(lightest) < 4.5) {
      const nextDarkest = darkest.withLightness(darkest.lightness() - 1, { "outOfRange": [ 1,99 ] })
      const nextLightest = lightest.withLightness(lightest.lightness() + 1, { "outOfRange": [ 1,99 ] })
      if ( (nextDarkest.lightness() <= 1) || (nextLightest.lightness() >= 99) ) {
        break
      }
      lightest = nextLightest
      darkest = nextDarkest
    }

    // Now, find a dark/light combo that contrasts with itself more

    let reallyDarkest = darkest.withLightness(darker.lightness() - 3, { "outOfRange": [ 1, 99 ]})
    let reallyLightest = lightest.withLightness(lighter.lightness() + 3, { "outOfRange": [ 1, 99 ]})

    while (darkest.contrast(lightest) < 9) {
      const nextDarkest = reallyDarkest.withLightness(reallyDarkest.lightness() - 1, { "outOfRange": [ 1,99 ] })
      const nextLightest = reallyLightest.withLightness(reallyLightest.lightness() + 1, { "outOfRange": [ 1,99 ] })
      if ( (nextDarkest.lightness() <= 1) || (nextLightest.lightness() >= 99) ) {
        break
      }
      reallyLightest = nextLightest
      reallyDarkest = nextDarkest
    }

    if (numShades == 5) {
      this.shades = [
        reallyDarkest,
        darker,
        color,
        lighter,
        reallyLightest,
      ]
    }
    else {
      this.shades = [
        reallyDarkest,
        darkest,
        darker,
        color,
        lighter,
        lightest,
        reallyLightest,
      ]
    }
  }
}

export default class ColorScale extends ColorScaleBase {
  static scale(name) {
    if (name == "FixedLabLightness") {
      return FixedLabLightness
    }
    else if (name == "FixedHSLLightness") {
      return FixedHSLLightness
    }
    else if (name == "EnsureContrast") {
      return EnsureContrast
    }
    else if (name == "Chroma") {
      return ChromaScale
    }
    else {
      return ColorScale
    }
  }
  constructor(color, numShades) {
    super(color,numShades)
    let darkest = this.color.darkest()
    let dark = this.color.dark()
    let lightest = this.color.lightest()
    let light = this.color.light()
    if (this.numShades == 5) {
      this.shades = [
        darkest,
        dark,
        color,
        light,
        lightest,
      ]
    }
    else {
      this.shades = [
        darkest,
        dark,
        dark.lighten(3),
        color,
        light.darken(3),
        light,
        lightest,
      ]
    }
  }

}
