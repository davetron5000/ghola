import BaseCustomElement          from "../brutaldom/BaseCustomElement"
import PaletteColorScaleComponent from "./PaletteColorScaleComponent"
import ColorNameComponent         from "./ColorNameComponent"

export default class AddColorScaleButtonComponent extends BaseCustomElement {

  static tagName = "g-add-color-scale-button"
  static observedAttributes = [
    "link-algorithm",
    "palette",
    "show-warnings",
  ]

  constructor() {
    super()
    this.addScaleClickListener = (event) => {
      event.preventDefault()
      this.addColorScales()
    }
  }

  linkAlgorithmChangedCallback({newValue}) {
    this.algorithmName = newValue
  }

  paletteChangedCallback({newValue}) {
    this.paletteId = newValue
  }

  render() {
    const buttons = this.querySelectorAll("button")
    if (buttons.length == 0)  {
      this.logger.warn("No <button> elements found within - this won't do anythning")
    }
    buttons.forEach( (button) => {
      button.addEventListener("click", this.addScaleClickListener)
    })
    if (this.paletteId) {
      this.palette = document.getElementById(this.paletteId)
      if (!this.palette) {
        if (this.isConnected) {
          this.logger.warn("No element with id '%s' found in document",this.paletteId)
        }
      }
      else if (this.palette.tagName.toLowerCase() != "g-palette") {
        this.logger.warn("Element with id '%s' is not a g-palette, but a %s",this.paletteId,this.palette.tagName)
      }
    }
    else {
      const palettes = document.querySelectorAll("g-palette")
      if (palettes.length > 1) {
        this.logger.warn("More than one g-palette found in document - behavior is not defined in this case")
      }
      this.palette = palettes[0]
    }
  }

  static nameToAlgo = {
    "complement": [ "complement" ],
    "split-complement": [ "split-complement-lower", "split-complement-upper" ],
    "analogous": [ "analogous-lower", "analogous-upper" ],
    "triad": [ "triad-lower", "triad-upper" ],
  }

  addColorScales() {
    if (!this.palette) {
      return
    }
    if (this.algorithmName) {
      const algos = this.constructor.nameToAlgo[this.algorithmName]
      if (algos) {
        algos.forEach( (algorithm) => {
          PaletteColorScaleComponent.cloneAndAppend(this.palette,{linkAlgorithm: algorithm})
        })
      }
      else {
        this.logger.warn(`No such algorithm ${this.algorithmName}`)
      }
    }
    else {
      PaletteColorScaleComponent.cloneAndAppend(this.palette)
    }
  }
}
