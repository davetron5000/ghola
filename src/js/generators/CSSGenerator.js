import Generator from "./Generator"
export default class CSSGenerator extends Generator {
  blob() {
    const namesUsed = {}

    const css = [
      "/*",
      window.location,
      " */",
      "",
    ]
    css.push(":root {")
    css.push("")
    this._eachColor({
      beforeGroup: () => css.push(""),
      onColor: (name,color,index,array) => {
        css.push(this._variableName(name,color,index,array))
      }
    })
    css.push("}")
    return new Blob([css.join("\n")],{ type: "text/css" })
  }

  _variableName(name,color,index,_array) {
        return `  --${name.toLowerCase()}-${index+1}: ${color};`
  }

}
