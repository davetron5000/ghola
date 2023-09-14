export default class ColorScale {
  static normalizeNumShades(numShades) {
    if (numShades <= 5) {
      return 5
    }
    else {
      return 7
    }
  }
  constructor(color, numShades) {
    numShades = this.constructor.normalizeNumShades(numShades)
    let darkest = color.darkest()
    let dark = color.dark()
    let lightest = color.lightest()
    let light = color.light()
    if (numShades == 5) {
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

  colors(f) {
    return this.shades
  }
}
