export default class CSSVariablesGenerator {
  constructor(palette) {
    this.palette = palette
  }

  blob() {
    const css = [
      "/*",
      window.location,
      " */",
      "",
    ]
    css.push(":root {")
    css.push("")
    Object.entries(this.palette.palette).forEach( ([name,shades]) => {
      css.push("")
      shades.forEach( (color, index, array) => {
        css.push(this._variableName(name,color,index,array))
      })
    })
    css.push("}")
    return new Blob([css.join("\n")],{ type: "text/css" })
  }

  _variableName(name,color,index,_array) {
        return `  --${name.toLowerCase()}-${index+1}: ${color.hex()}; /* ${color.name()} */`
  }

}
