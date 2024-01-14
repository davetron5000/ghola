import AddColorScaleButtonComponent from "./components/AddColorScaleButtonComponent"
import AttributeCheckboxComponent   from "./components/AttributeCheckboxComponent"
import ColorNameComponent           from "./components/ColorNameComponent"
import ColorSwatchComponent         from "./components/ColorSwatchComponent"
import DownloadPaletteComponent     from "./components/DownloadPaletteComponent"
import ElementSourceComponent       from "./brutaldom/components/ElementSourceComponent"
import PaletteColorScaleComponent   from "./components/PaletteColorScaleComponent"

import Color from "./Color"
import NotValidHexCode from "./NotValidHexCode"

document.addEventListener("DOMContentLoaded", () => {
  AddColorScaleButtonComponent.define()
  AttributeCheckboxComponent.define()
  ColorNameComponent.define()
  ColorSwatchComponent.define()
  DownloadPaletteComponent.define()
  ElementSourceComponent.define()
  PaletteColorScaleComponent.define()

  const url = new URL(window.location);
  if (url.searchParams.get("compact") == "true") {
    document.querySelectorAll(`${AttributeCheckboxComponent.tagName}[attribute-name='compact']`).forEach( (checkbox) => {
      checkbox.check()
    })
  }
  const primaryColor = url.searchParams.get("primaryColor")
  if (primaryColor) {
    const [hex,userSuppliedName] = primaryColor.split(/:/)
    const color = Color.fromHexCode(hex)
    document.querySelectorAll(`${PaletteColorScaleComponent.tagName}[primary]`).forEach( (element) => {
      element.baseColorSwatch.setAttribute("hex-code",color.hexCode())
      if (userSuppliedName) {
        element.overrideColorName(userSuppliedName)
      }
    })
    const palette = document.querySelector("g-palette")
    const otherColors = url.searchParams.get("otherColors")
    if (palette && otherColors) {
      otherColors.split(/,/).forEach( (colorAndName) => {
        const [hexOrAlgorithm,userSuppliedName] = colorAndName.split(/:/)
        let newScale = null
        try {
          const color = Color.fromHexCode(hexOrAlgorithm)
          newScale = PaletteColorScaleComponent.cloneAndAppend(palette,{ hexCode: color.hexCode() })
        }
        catch (e) {
          if (e instanceof NotValidHexCode) {
            const algorithm = hexOrAlgorithm
            newScale = PaletteColorScaleComponent.cloneAndAppend(palette,{ linkAlgorithm: algorithm })
          }
          else {
            throw e
          }
        }
        if (userSuppliedName) {
          newScale.overrideColorName(userSuppliedName)
        }
      })
    }
  }
})
