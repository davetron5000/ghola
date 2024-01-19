import Generator from "./Generator"
export default class CSVGenerator extends Generator {
  blob() {
    const csv = [
      [ "Color Category", "Hex" ].join(","),
    ]
    this._eachColor({
      onColor: (name,color,index) => {
        csv.push([
          name.toString().replaceAll(/['\",]/g,"-") + "-" + (index+1),
          color,
        ].join(","))
      }
    })
    return new Blob([csv.join("\n")],{ type: "text/csv" })
  }
}
