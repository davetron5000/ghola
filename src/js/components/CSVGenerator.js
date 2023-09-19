export default class CSVGenerator {
  constructor(palette) {
    this.palette = palette
  }

  blob() {
    const csv = [
      [ "Color Category", "Color Name", "Hex" ].join(","),
    ]
    Object.entries(this.palette.palette).forEach( ([name,shades]) => {
      shades.forEach( (color) => {
        csv.push([
          name,
          color.name(),
          color.hex(),
        ].join(","))
      })
    })
    return new Blob([csv.join("\n")],{ type: "text/csv" })
  }

}
