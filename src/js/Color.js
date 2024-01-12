import colorConvert from "color-convert"
export default class Color {

  static HEX_REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")

  static fromHexCode(hexCode) {
    return new Color(hexCode)
  }

  static fromHSL(h,s,l) {
    return new Color(colorConvert.hsl.hex(h,s,l))
  }

  static fromRGB(r,g,b) {
    return new Color(colorConvert.rgb.hex(parseInt(r),parseInt(g),parseInt(b)))
  }

  static random() {
    return Color.fromRGB(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    )
  }

  constructor(hexCodeAsString) {
    if (!hexCodeAsString) {
      throw `Color must be given a hex code`
    }
    const [matches, _hash, hexCode] = hexCodeAsString.match(Color.HEX_REGEXP)
    if (!matches) {
      throw `'${hexCodeAsString}' is not a valid hex code`
    }
    this.hex = `#${hexCode}`.toUpperCase()
  }

  hsl() {
    return colorConvert.hex.hsl.raw(this.hex)
  }

  hexCode() {
    return this.hex
  }
}
