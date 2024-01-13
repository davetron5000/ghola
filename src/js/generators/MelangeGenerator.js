import CSSGenerator from "./CSSGenerator"
export default class MelangeGenerator extends CSSGenerator {
  static shadeNames = [
    "-darkest",
    "-darker",
    "-dark",
    "",
    "-light",
    "-lighter",
    "-lightest",
  ]
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
    if ( (array.length != 5) && (array.length != 7) ) {
      throw `MelangeCSSVariablesGenerator cannot work with ${array.length} shades. Must be 5 or 7`
    }
    let adjustedIndex = array.length == 5 ? index + 1 : index
    const shadeName = this.constructor.shadeNames[adjustedIndex]
    const normalizedName = name.toLowerCase()
    const recognized = this.constructor.melanageRecognizedColors.indexOf(normalizedName) != -1
    return `${ recognized ? '' : "  /* WARNING: this name is not recognized by Melange */\n"}  --mg-${normalizedName}${shadeName}: ${color};`
  }
}
