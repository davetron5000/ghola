import { TypeOf } from "brutaljs"
import chroma from "chroma-js"

import Color from "./Color"
import NumericRange from "./NumericRange"


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

class ChromaScale extends ColorScaleBase {
  constructor(color, numShades) {
    super(color, numShades)
    const scale = chroma.scale(["black", color.hex(), "white"])
    this.shades = scale.colors(numShades + 2).slice(1,numShades+1).map( (chromaColor) => {
      return new Color(chromaColor)
    })
  }
}

class LinearLightnessScale {
  constructor(color, numSteps, discard=1) {
    const numScale = numSteps + (2 * discard)
    this.steps = []
    let lightness = color.lightness() / 100
    if (lightness == 0) {
      lightness = 0.01
    }
    else if (lightness == 1) {
      lightness = 0.99
    }
    for (let i = 0; i < numScale; i++) {
      const previous = i-1 / (numScale-1)
      let percent  = i   / (numScale-1)
      if (percent == 0) {
        percent = 0.01
      }
      else if (percent == 1) {
        percent = 0.99
      }
      if ((lightness > previous) && (lightness < percent)) {
        this.steps.push( lightness * 100)
      }
      else {
        this.steps.push( percent * 100)
      }
    }
    this.steps = this.steps.slice(discard,numSteps+discard)

  }
}

class LogLightnessScale {
  constructor(color, numSteps, min_percent = 0.1, la=1, lx=1.5, da=2, dx=2, fudge=0) {
    this.steps = []
    let lightness = color.lightness() / 100
    if (lightness == 0) {
      lightness = 0.01
    }
    else if (lightness == 1) {
      lightness = 0.99
    }
    for (let i = 0; i < numSteps; i++) {
      const previous = this.steps[i-1] / 100
      let percent  = (i+1) / (numSteps)
      if (percent == 0) {
        percent = 0.01
      }
      else if (percent == 1) {
        percent = 0.99
      }

      if (percent < 0.5) {
        percent = la * Math.pow(percent,lx)
        percent = (percent - (percent * fudge))
      }
      else if (percent > 0.5) {
        percent = 1 - ( da * Math.pow(1-percent,dx) )
        percent = (percent + ((1-percent) * fudge))
      }
      if (percent < min_percent) {
        if (i == 0) {
          percent = 0.1
        }
        else if (i == 1) {
          percent = 0.13
        }
      }
      if (!isNaN(previous) && (lightness > previous) && (lightness < percent)) {
        this.steps.push( lightness * 100)
      }
      else {
        this.steps.push( percent * 100 )
      }
      if ( i > 0 ) {
        if (this.steps[i] < this.steps[i-1]) {
          const p = (i+1) / numSteps
          throw `WTF: ${i} ${p} 1 - ( ${da} * Math.pow(1-${p},${dx}) ) ${this.steps}`
        }
      }
    }
  }
}


class TweakedFixedHSLLightness extends ColorScaleBase {
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

class FixedLightness extends ColorScaleBase {
  constructor(color, numShades, baseColor) {
    super(color, numShades)
    this.shades = this._scale(baseColor,numShades).steps.map( (lightness) => {
      return this.color.withLightness(Math.max(1,Math.min(99,lightness)), { model: this._model(), outOfRange: [ 1,99] })
    })
  }
}
class FixedHSLLightness extends FixedLightness {
  _model() { return "hsl" }
}

class HSLHandCraftedScale extends LinearLightnessScale {
  constructor(baseColor,numShades) {
    super(baseColor,numShades)
    if (numShades == 5) {
      this.steps = [
        12,
        20,
        50,
        85,
        98,
      ]
    }
    else if (numShades == 7) {
      this.steps = [
        8,
        12,
        20,
        50,
        70,
        85,
        98,
      ]
    }
    for (let i = 1; i < this.steps.length; i++) {
      const prev = this.steps[i-1]
      if ( prev > baseColor.lightness() && this.steps[i] < baseColor.lightness() ) {
        this.steps[i-1] = baseColor.lightness()
      }
    }
  }
}
class LabHandCraftedScale extends LinearLightnessScale {
  constructor(baseColor,numShades) {
    super(baseColor,numShades)
    if (numShades == 5) {
      this.steps = [
        1,
        20,
        50,
        85,
        100,
      ]
    }
    else if (numShades == 7) {
      this.steps = [
        1,
        12,
        30,
        50,
        70,
        85,
        100,
      ]
    }
    for (let i = 1; i < this.steps.length; i++) {
      const prev = this.steps[i-1]
      if ( prev > baseColor.lightness() && this.steps[i] < baseColor.lightness() ) {
        this.steps[i-1] = baseColor.lightness()
      }
    }
  }
}
class FixedHSLLinearLightness extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new LinearLightnessScale(baseColor,numShades) }
}

class FixedHSLHandCrafted extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new HSLHandCraftedScale(baseColor,numShades) }
}

class FixedHSLLogLightness extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new LogLightnessScale(baseColor,numShades) }
}

class FixedLabLightness extends FixedLightness {
  _model() { return "lab" }
}

class FixedLabLinearLightness extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LinearLightnessScale(baseColor,numShades,0) }
}

class FixedLabLogLightness extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LogLightnessScale(baseColor,numShades, 0,16,4, 1, 1, 0.6) }
}
class FixedLabHandCrafted extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LabHandCraftedScale(baseColor,numShades) }
}

class NotUsedEnsureContrast extends ColorScaleBase {
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

class EnsureContrast extends ColorScaleBase {

  findContrast(color1,color2,contrast,delta) {
    let newColor = color1
    while (newColor.contrast(color2) < contrast) {
      const next = delta < 1 ? newColor.darken() : newColor.lighten() //withLightness(newColor.lightness() + delta, { outOfRange: [ 1,99 ] })
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

export default class ColorScale extends ColorScaleBase {
  static scale(name) {
    if (name == "FixedHSLLinearLightness") {
      return FixedHSLLinearLightness
    }
    else if (name == "FixedHSLLogLightness") {
      return FixedHSLLogLightness
    }
    else if (name == "FixedHSLHandCrafted") {
      return FixedHSLHandCrafted
    }
    else if (name == "FixedLabLinearLightness") {
      return FixedLabLinearLightness
    }
    else if (name == "FixedLabLogLightness") {
      return FixedLabLogLightness
    }
    else if (name == "FixedLabHandCrafted") {
      return FixedLabHandCrafted
    }
    else if (name == "EnsureContrast") {
      return EnsureContrast
    }
    else if (name == "Chroma") {
      return ChromaScale
    }
    else {
      throw `No such scale ${name}`
    }
  }
}
