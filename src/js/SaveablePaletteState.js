import Palette from "./Palette"
import PaletteEntry from "./PaletteEntry"
import Color from "./Color"

export default class SaveablePaletteState {
  start() {
    this.pushState(window.location.toString(), { setURL: false })
  }

  savePalette(palette) {
    const url = new URL(window.location);
    const urlNow = url.toString()
    if (palette.primaryColor) {
      url.searchParams.set(
        "primaryColor",
        palette.primaryColor.userSuppliedName ? 
        `${palette.primaryColor.hexCode}:${palette.primaryColor.userSuppliedName}` : palette.primaryColor.hexCode
      )
    }
    const otherColorsValue = palette.otherColors.map( (otherColor) => {
      console.log(otherColor)
      let value = otherColor.hexCode || otherColor.algorithm
      if (otherColor.userSuppliedName) {
        value = value + ":" + otherColor.userSuppliedName
      }
      return value
    }).join(",")
    url.searchParams.set("otherColors",otherColorsValue)
    url.searchParams.set("compact",String(!!palette.compact))

    if (urlNow != url.toString()) {
      this.pushState(url.toString(),{ setURL: true })
    }
  }

  loadPalette() {
    const url = new URL(window.location)
    const primaryColorValue = url.searchParams.get("primaryColor")

    if (primaryColorValue) {

      const compact = url.searchParams.get("compact") == "true"
      const otherColorsValue = url.searchParams.get("otherColors")

      const [hex,userSuppliedName] = primaryColorValue.split(/:/)
      const color = Color.fromHexCode(hex)
      let otherColors = []
      const primaryColor = new PaletteEntry({
        hexCode: color.hexCode(),
        userSuppliedName: userSuppliedName,
      })

      otherColorsValue && otherColorsValue.split(/,/).forEach( (colorAndName) => {
        const [hexOrAlgorithm,userSuppliedName] = colorAndName.split(/:/)
        const color = Color.fromHexCode(hexOrAlgorithm, { onError: "return" })
        if (color) {
          otherColors.push(
            new PaletteEntry({
              hexCode: color.hexCode(),
              userSuppliedName: userSuppliedName,
            })
          )
        }
        else {
          otherColors.push(
            new PaletteEntry({
              algorithm: hexOrAlgorithm,
              userSuppliedName: userSuppliedName,
            })
          )
        }
      })
      return new Palette(primaryColor,otherColors,compact)
    }
    else {
      return new Palette()
    }
  }

  pushState(url, { setURL }) {
    const state = { url: url }
    history.pushState(
      state,
      "",
      setURL ? url : null
    )
  }
}
