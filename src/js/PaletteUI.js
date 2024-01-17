import PaletteEntry from "./PaletteEntry"
import AttributeCheckboxComponent   from "./components/AttributeCheckboxComponent"
import PaletteColorScaleComponent   from "./components/PaletteColorScaleComponent"

export default class PaletteUI {
  constructor(pushState) {
    this.pushState = pushState

    if (!this.pushState) {
      throw "PushState is required"
    }

    this.palette = this.pushState.loadPalette()
  }
  build() {
    const paletteComponent = document.querySelector("g-palette")
    if (!paletteComponent) {
      return
    }
    const url = new URL(window.location);
    if (url.searchParams.get("compact") == "true") {
      document.querySelectorAll(`${AttributeCheckboxComponent.tagName}[attribute-name='compact']`).forEach( (checkbox) => {
        checkbox.check()
      })
    }
    document.querySelectorAll(`${PaletteColorScaleComponent.tagName}`).forEach( (element) => {
      if (!element.isPrimary) {
        element.parentElement.removeChild(element)
      }
    })
    document.querySelectorAll(`${AttributeCheckboxComponent.tagName}[attribute-name='compact']`).forEach( (checkbox) => {
      if (this.palette.compact) {
        checkbox.check()
      }
      else {
        checkbox.uncheck()
      }
    })
    document.querySelectorAll(`${PaletteColorScaleComponent.tagName}[primary]`).forEach( (element) => {
      this.palette.withPrimaryColor( (hexCode) => element.baseColorSwatch.setAttribute("hex-code",hexCode) )
      this.palette.whenPrimaryNameUserOverride( (name) => element.overrideColorName(name) )
      this.palette.whenPrimaryNameDefault( () => element.restoreDefaultColorName() )
    })
    this.palette.otherColors.forEach( (otherColor) => {
      let newScale = null
      otherColor.whenHexCode( (hexCode) => {
        newScale = paletteComponent.addScale({ hexCode: hexCode })
      })
      otherColor.whenAlgorithm( (algorithm) => {
        newScale = paletteComponent.addScale({ linkAlgorithm: otherColor.algorithm })
      })
      if (newScale) {
        otherColor.whenNameUserOverride( (name) => newScale.overrideColorName(name) )
        otherColor.whenNameDefault( () => newScale.restoreDefaultColorName(name) )
      }
    })
    paletteComponent.addEventListener("palette-change", () => {
      paletteUI.extractPalette()
      this.pushState.savePalette(this.palette)
    })
    document.querySelectorAll(`${AttributeCheckboxComponent.tagName}[attribute-name='compact']`).forEach( (checkbox) => {
      checkbox.addEventListener("change",() => {
        this.palette.compact = checkbox.checked
        this.pushState.savePalette(this.palette)
      })
    })
  }

  extractPalette() {
    const paletteComponent = document.querySelector("g-palette")
    if (!paletteComponent) {
      return
    }
    if (paletteComponent.primaryColor) {
      this.palette.primaryColor = new PaletteEntry({
        hexCode: paletteComponent.primaryColor.hexCode,
        userSuppliedName: paletteComponent.primaryColor.colorNameUserOverride ? paletteComponent.primaryColor.colorName : null
      })
      const otherColors = paletteComponent.otherColors.map( (other) => {
        const userSuppliedName = other.colorNameUserOverride ? other.colorName : null
        if (other.hexCode) {
          return new PaletteEntry({ hexCode: other.hexCode, userSuppliedName: userSuppliedName })
        }
        else {
          return new PaletteEntry({ algorithm: other.algorithm, userSuppliedName: userSuppliedName })
        }
      })
      this.palette.otherColors = otherColors
      this.palette.compact = !!paletteComponent.getAttribute("compact")
    }
  }
}
