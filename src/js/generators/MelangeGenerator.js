import CSSGenerator from "./CSSGenerator"
export default class MelangeGenerator extends CSSGenerator {
  static shadeNames = {
    "9": [
      "-100",
      "-200",
      "-300",
      "-400",
      "-500",
      "-600",
      "-700",
      "-800",
      "-900",
    ],
    "7": [
      "-100",
      "-200",
      "-300",
      "-500",
      "-700",
      "-800",
      "-900",
    ],
    "5": [
      "-100",
      "-300",
      "-500",
      "-700",
      "-900",
    ],
  }
  static melanageRecognizedColors = [
    "red",
    "blue",
    "gray",
    "green",
    "orange",
    "purple",
    "red",
    "yellow",
  ]

  _variableName(name,color,index,array) {
    const key = String(array.length)
    const shadeNames = this.constructor.shadeNames[key]
    if (!shadeNames) {
      throw `MelangeCSSVariablesGenerator cannot work with ${array.length} shades. Must be 5, 7, or 9`
    }
    const shadeName = shadeNames[index]
    const normalizedName = name.toLowerCase()
    const recognized = this.constructor.melanageRecognizedColors.indexOf(normalizedName) != -1
    return `${ recognized ? '' : "  /* WARNING: this name is not recognized by Melange */\n"}  --${normalizedName}${shadeName}: ${color};`
  }
}
