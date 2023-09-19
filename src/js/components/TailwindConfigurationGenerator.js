export default class TailwindConfigurationGenerator {
  constructor(palette) {
    this.palette = palette
  }

  blob() {
    const numShades = Object.values(this.palette.palette)[0].length
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
    Object.entries(this.palette.palette).forEach( ([name,shades]) => {
      js.push(`  "${name.toLowerCase()}": {`)
      shades.reverse().forEach( (color, index, array) => {
        if (index == 0) {
          js.push(`    100: "${color.hex()}",`)
          js.push(`    200: "${color.hex()}",`)
        }
        else if (index == (array.length-1) ) {
          js.push(`    800: "${color.hex()}",`)
          js.push(`    900: "${color.hex()}",`)
        }
        else {
          if (array.length == 5) {
            if (index == 1) {
              js.push(`    300: "${color.hex()}",`)
              js.push(`    400: "${color.hex()}",`)
            }
            else if (index == (array.length-2)) {
              js.push(`    600: "${color.hex()}",`)
              js.push(`    700: "${color.hex()}",`)
            }
            else {
              js.push(`    500: "${color.hex()}",`)
            }
          }
          else {
            js.push(`    ${index+2}00: "${color.hex()}",`)
          }
        }
      })
      js.push(`  },`)
    })
    js.push("}")
    return new Blob([js.join("\n")],{ type: "text/plain" })
  }

}
