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

  luminance() {
    // https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
    const [r8Bit,g8Bit,b8Bit] = colorConvert.hex.rgb(this.hex)

    const rsRGB = r8Bit / 255
    const gsRGB = g8Bit / 255
    const bsRGB = b8Bit / 255

    const r = rsRGB < 0.04045 ? rsRGB / 12.92 : Math.pow( ((rsRGB+0.055)/1.055), 2.4)
    const g = gsRGB < 0.04045 ? gsRGB / 12.92 : Math.pow( ((gsRGB+0.055)/1.055), 2.4)
    const b = bsRGB < 0.04045 ? bsRGB / 12.92 : Math.pow( ((bsRGB+0.055)/1.055), 2.4)

    return (0.2126 * r) + 
           (0.7152 * g) + 
           (0.0722 * b)
  }

  contrast(otherColor) {
    // https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
    let l1 = this.luminance()
    let l2 = otherColor.luminance()

    if (l1 < l2) {
      const swap = l1
      l1 = l2
      l2 = swap
    }

    return (l1 + 0.05) / (l2 + 0.05)
  }


  hsl() {
    return colorConvert.hex.hsl.raw(this.hex)
  }
  lab() {
    return colorConvert.hex.lab.raw(this.hex)
  }

  hexCode() {
    return this.hex
  }
}
export default Color
