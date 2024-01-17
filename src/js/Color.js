import colorConvert from "color-convert"

import NotValidHexCode from "./NotValidHexCode"

class Color {

  static HEX_REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")

  static fromHexCode(hexCode, {onError = "throw" } = {}) {
    if (hexCode) {
      try {
        return new Color(hexCode)
      }
      catch (e) {
        if (e instanceof Error) {
          if (onError == "return") {
            return null
          }
        }
        throw e
      }
    }
    else {
      return null
    }
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
      throw new TypeError("Color must be given a hex code")
    }
    const matches = hexCodeAsString.match(Color.HEX_REGEXP)
    if (!matches) {
      throw new NotValidHexCode(hexCodeAsString)
    }
    const [_matches, _hash, hexCode] = matches
    this.hex = `#${hexCode}`.toUpperCase()
  }

  hsl() {
    return colorConvert.hex.hsl.raw(this.hex)
  }

  hexCode() {
    return this.hex
  }
}
export default Color
