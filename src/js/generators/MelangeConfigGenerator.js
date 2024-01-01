import Generator from "./Generator"
export default class MelangeConfigGenerator extends Generator {

  blob() {
    const js = []
    this._eachColor({
      beforeGroup: (name) => {
        js.push("colorTints.register(")
        js.push(`  "${name.toString().toLowerCase()}",`)
        js.push("  [")
      },
      afterGroup: (name) => {
        js.push("  ]")
        js.push(")")
        js.push("")
      },
      onColor: (name,color,index,array) => {
        js.push(`    "${color.hexCode}",`)
      },
      reverse: true,
    })
    return new Blob([js.join("\n")],{ type: "text/plain" })
  }

  _variableName(name,color,index,array) {
    if ( (array.length != 5) && (array.length != 7) ) {
      throw `MelangeCSSVariablesGenerator cannot work with ${array.length} shades. Must be 5 or 7`
    }
    let adjustedIndex = array.length == 5 ? index + 1 : index
    const shadeName = this.constructor.shadeNames[adjustedIndex]
    const normalizedName = name.toLowerCase()
    const recognized = this.constructor.melanageRecognizedColors.indexOf(normalizedName) != -1
    return `${ recognized ? '' : "  /* WARNING: this name is not recognized by Melange */\n"}  --mg-${normalizedName}${shadeName}: ${color.hexCode}; /* ${color.name} */`
  }
}
