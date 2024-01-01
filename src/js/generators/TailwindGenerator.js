import Generator from "./Generator"

export default class TailwindGenerator extends Generator {

  blob() {
    const numShades = this.colorShades[0].scale.length
    if ((numShades != 7) && (numShades != 5)) {
      throw `TailwindConfigurationGenerator is not compatible with ${numShades} shades. Must be 7 or 5`
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
          js.push(`    100: "${color.hexCode}",`)
          js.push(`    200: "${color.hexCode}",`)
        }
        else if (index == (array.length-1) ) {
          js.push(`    800: "${color.hexCode}",`)
          js.push(`    900: "${color.hexCode}",`)
        }
        else {
          if (array.length == 5) {
            if (index == 1) {
              js.push(`    300: "${color.hexCode}",`)
              js.push(`    400: "${color.hexCode}",`)
            }
            else if (index == (array.length-2)) {
              js.push(`    600: "${color.hexCode}",`)
              js.push(`    700: "${color.hexCode}",`)
            }
            else {
              js.push(`    500: "${color.hexCode}",`)
            }
          }
          else {
            js.push(`    ${index+2}00: "${color.hexCode}",`)
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
