import Generator from "./Generator"

export default class TailwindGenerator extends Generator {

  blob() {
    const numShades = this.colorShades[0].scale.length
    if ((numShades != 9) && (numShades != 7) && (numShades != 5)) {
      throw `TailwindConfigurationGenerator is not compatible with ${numShades} shades. Must be 9, 7, or 5`
    }
    const js = [
      `// ${window.location}`,
      "",
      "colors: {",
      "  transparent: 'transparent',",
      "  current: 'currentColor',",
    ]
    this._eachColor({
      reverse: true,
      beforeGroup: (name) => {
        js.push(`  "${name}": {`)
      },
      onColor: (name,color,index,array) => {
        if (index == 0) {
          js.push(`    50: "${color}",`)
          js.push(`    100: "${color}",`)
          if (array.length < 9) {
            js.push(`    200: "${color}",`)
          }
        }
        else if (index == (array.length-1) ) {
          if (array.length < 9) {
            js.push(`    800: "${color}",`)
          }
          js.push(`    900: "${color}",`)
          js.push(`    950: "${color}",`)
        }
        else {
          if (array.length == 5) {
            if (index == 1) {
              js.push(`    300: "${color}",`)
              js.push(`    400: "${color}",`)
            }
            else if (index == (array.length-2)) {
              js.push(`    600: "${color}",`)
              js.push(`    700: "${color}",`)
            }
            else {
              js.push(`    500: "${color}",`)
            }
          }
          else {
            if (array.length < 9) {
              js.push(`    ${index+2}00: "${color}",`)
            }
            else {
              js.push(`    ${index+1}00: "${color}",`)
            }
          }
        }
      },
      afterGroup: (name) => {
        js.push(`  },`)
      },
    })
    js.push("}")
    return new Blob([js.join("\n")],{ type: "text/plain" })
  }
}
