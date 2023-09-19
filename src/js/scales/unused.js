
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
