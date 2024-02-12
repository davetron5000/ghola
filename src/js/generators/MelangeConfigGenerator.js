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
        js.push(`    "${color}",`)
      },
      reverse: true,
    })
    return new Blob([js.join("\n")],{ type: "text/plain" })
  }
}
