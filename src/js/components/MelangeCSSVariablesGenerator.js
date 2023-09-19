import CSSVariablesGenerator from "./CSSVariablesGenerator"
export default class MelangeCSSVariablesGenerator extends CSSVariablesGenerator {
  static shadeNames = [
    "-darkest",
    "-darker",
    "-dark",
    "",
    "-light",
    "-lighter",
    "-lightest",
  ]
  _variableName(name,color,index,array) {
    if ( (array.length != 5) && (array.length != 7) ) {
      throw `MelangeCSSVariablesGenerator cannot work with ${array.length} shades. Must be 5 or 7`
    }
    let adjustedIndex = array.length == 5 ? index + 1 : index
    const shadeName = this.constructor.shadeNames[adjustedIndex]
    return `  --mg-${name.toLowerCase()}${shadeName}: ${color.hex()}; /* ${color.name()} */`
  }
}
