import BaseCustomElement          from "../brutaldom/BaseCustomElement"
import PaletteColorScaleComponent from "./PaletteColorScaleComponent"
import ColorNameComponent         from "./ColorNameComponent"
import PreviewComponent           from "./PreviewComponent"
import SaveablePaletteState       from "../SaveablePaletteState"
import UnsaveablePaletteState     from "../UnsaveablePaletteState"

export default class PaletteComponent extends BaseCustomElement {

  static tagName = "g-palette"
  static observedAttributes = [
    "show-warnings",
    "save-state",
  ]

  saveStateChangedCallback({newValue}) {
    if (newValue || newValue === "") {
      this._saveableState = new SaveablePaletteState()
    }
    else {
      this._saveableState = new UnsaveablePaletteState()
    }
  }

  get saveableState() {
    return this._saveableState
  }

  constructor() {
    super()
    this._saveableState = new UnsaveablePaletteState()
    this.colorChangeEventListener = (event) => {
      this.dispatchEvent(new CustomEvent("palette-change", { cancelable: false, bubbles: true }))
    }
    this.previewScaleEventListener = (event) => {
      const dialog = document.getElementById("preview-dialog")
      const preview = dialog.querySelector("g-preview")
      if (preview && (preview instanceof PreviewComponent)) {
        preview.colorScale = event.detail.colorScale
      }
      else {
        console.warn("Expected the dialog to have a g-preview inside, but found %o",preview)
      }
      dialog.querySelectorAll("button[data-close]").forEach( (button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault()
          dialog.close()
        })
      })
      dialog.showModal()
    }
  }


  render() {
    this.querySelectorAll(PaletteColorScaleComponent.tagName).forEach( (colorScale) => {
      this._addScaleEventListeners(colorScale)
    })

  }

  get primaryColor() {
    const primary = this.primaryColorScale
    if (!primary) {
      return {}
    }
    return {
      hexCode: primary.baseColorSwatch.hexCode,
      colorName: primary.colorName,
      colorNameUserOverride: primary.colorNameUserOverride,
    }

  }

  get otherColors() {
    const otherColors = []
    this.querySelectorAll(PaletteColorScaleComponent.tagName).forEach( (element) => {
      if (element.isPrimary) {
        return
      }
      if (element.linkedPrimaryAlgorithm) {
        otherColors.push({
          algorithm: element.linkedPrimaryAlgorithm,
          colorName: element.colorName,
          colorNameUserOverride: element.colorNameUserOverride,
        })
      }
      else {
        otherColors.push({
          hexCode: element.baseColorSwatch.hexCode,
          colorName: element.colorName,
          colorNameUserOverride: element.colorNameUserOverride,
        })
      }
    })
    return otherColors
  }

  get primaryColorScale() {
    return this.querySelector(PaletteColorScaleComponent.tagName + "[primary]")
  }

  addScale({linkAlgorithm=null,hexCode=null}={}) {
    const primary = this.primaryColorScale
    if (!primary) {
      this.logger.warn("Palette has no primary color scale, so there is no reference to duplicate when adding a new scale")
      return
    }

    if (linkAlgorithm && this.querySelector(PaletteColorScaleComponent.tagName + `[linked-to-primary='${linkAlgorithm}']`)) {
      return
    }
    const newScale = primary.cloneNode(true)
    newScale.removeAttribute("primary")
    newScale.baseColorSwatch.removeAttribute("id") // force the scale to generate one
    newScale.baseColorSwatch.removeAttribute("default-link-context")
    if (linkAlgorithm) {
      newScale.baseColorSwatch.querySelectorAll("input[type=color]").forEach( (input) => {
        input.setAttribute("disabled",true)
      })
    }
    newScale.swatches.forEach( (swatch) => swatch.removeAttribute("derived-from") )

    this.appendChild(newScale)

    if (linkAlgorithm) {
      newScale.baseColorSwatch.removeAttribute("hex-code")
      newScale.setAttribute("linked-to-primary",linkAlgorithm)
    }
    else {
      if (hexCode) {
        newScale.baseColorSwatch.setAttribute("hex-code", hexCode)
      }
      else {
        newScale.baseColorSwatch.setAttribute("hex-code", Color.random().hexCode())
      }
    }

    newScale.querySelectorAll(ColorNameComponent.tagName).forEach( (colorName) => {
      if (colorName.getAttribute("color-swatch") == primary.baseColorSwatch.id) {
        colorName.setAttribute("color-swatch",newScale.baseColorSwatch.id)
        colorName.restoreDefaultColorName()
      }
    })
    this.dispatchEvent(new CustomEvent("palette-change",{ cancelable: false, bubbles: true }))
    this._addScaleEventListeners(newScale)
    return newScale
  }

  _addScaleEventListeners(scale) {
    scale.addEventListener("base-color-changed", this.colorChangeEventListener)
    scale.addEventListener("unlink-from-primary", this.colorChangeEventListener)
    scale.addEventListener("remove-scale", this.colorChangeEventListener)
    scale.addEventListener("name-change", this.colorChangeEventListener)
    scale.addEventListener("name-cleared", this.colorChangeEventListener)
    scale.addEventListener("preview-scale", this.previewScaleEventListener)
  }

}
