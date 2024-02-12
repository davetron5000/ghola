import CSSGenerator from "./CSSGenerator"
export default class MelangeGenerator extends CSSGenerator {
  static shadeNames = {
    "9": [
      "-darkest",
      "-darker",
      "-dark",
      "-darkish",
      "",
      "-lightish",
      "-light",
      "-lighter",
      "-lightest",
    ],
    "7": [
      "-darkest",
      "-darker",
      "-dark",
      "",
      "-light",
      "-lighter",
      "-lightest",
    ],
    "5": [
      "-darkest",
      "-dark",
      "",
      "-light",
      "-lightest",
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
    return `${ recognized ? '' : "  /* WARNING: this name is not recognized by Melange */\n"}  --mg-${normalizedName}${shadeName}: ${color};`
  }
}
