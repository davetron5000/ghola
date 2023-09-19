export default class MelangeConfigurationGenerator {
  constructor(palette) {
    this.palette = palette
  }

  blob() {
    const numShades = Object.values(this.palette.palette)[0].length
    if ((numShades != 7) && (numShades != 5)) {
      throw `MelangeConfigurationGenerator is not compatible with ${numShades} shades. Must be 7 or 5`
    }
    const js = [
      `// ${window.location}`,
      "",
    ]
    Object.entries(this.palette.palette).forEach( ([name,shades]) => {
      js.push(`colorTints.register(`)
      js.push(`  "${name.toLowerCase()}",`)
      js.push(`  [`)
      shades.reverse().forEach( (color, index, array) => {
        js.push(`    "${color.hex()}",`)

        // For 5-color palettes, dupe the darkest/lightest as darker/lighter
        if ( (array.length == 5) && (index == 0 || index == 4) ) {
          js.push(`    "${color.hex()}",`)
        }
      })
      js.push(`  ]`)
      js.push(`)`)
    })
    return new Blob([js.join("\n")],{ type: "text/plain" })
  }

}
