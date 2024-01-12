import Color from "../Color"

export default class BaseDerivation {
  hsl(hexCode) {
    return Color.fromHexCode(hexCode).hsl()
  }

  hexCode(h,s,l) {
    return Color.fromHSL(h,s,l).hexCode()
  }
}
