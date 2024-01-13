import Generator from "./Generator"
export default class CSVGenerator extends Generator {
  blob() {
    const csv = [
      [ "Color Category", "Hex" ].join(","),
    ]
    this._eachColor({
      onColor: (name,color) => {
        csv.push([
          name.toString().replaceAll(/['\",]/g,"-"),
          color,
        ].join(","))
      }
    })
    return new Blob([csv.join("\n")],{ type: "text/csv" })
  }
}
