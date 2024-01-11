import chroma                     from "chroma-js"
import Logger                     from "../brutaldom/Logger"
import PaletteColorScaleComponent from "./PaletteColorScaleComponent"
import ColorNameComponent         from "./ColorNameComponent"

export default class AddColorScaleButtonComponent extends HTMLElement {

  static observedAttributes = [
    "link-algorithm",
    "palette",
    "debug",
  ]

  constructor() {
    super()
    this.logger = Logger.forPrefix(null)
    this.addScaleClickListener = (event) => {
      event.preventDefault()
      this.addColorScales()
    }
  }

  connectedCallback() {
    this.connected = true
    this.render()
  }

  disconnectedCallback() {
    this.disconnected = true
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "link-algorithm") {
      this.algorithmName = newValue
    }
    else if (name == "palette") {
      this.paletteId = newValue
    }
    else if (name == "debug") {
      let oldLogger
      if (!oldValue && newValue) {
        oldLogger = this.logger
      }
      const prefix = newValue == "" ? this.id : newValue
      this.logger = Logger.forPrefix(prefix || `UNKNOWN ${this.constructor.tagName}`)
      if (oldLogger) {
        this.logger.dump(oldLogger)
      }
    }
    this.render()
  }

  render() {
    if (this.disconnected) {
      return
    }
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
        if (this.connected) {
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

  addColorScales() {
    if (!this.palette) {
      return
    }
    const primary = this.palette.querySelector(PaletteColorScaleComponent.tagName + "[primary]")
    if (!primary) {
      this.logger.warn("Palette has no primary color scale, so there is no reference to duplicate when adding a new scale")
      return
    }
    if (this.algorithmName) {
      const nameToAlgo = {
        "complement": [ "complement" ],
        "split-complement": [ "split-complement-lower", "split-complement-upper" ],
        "analogous": [ "analogous-lower", "analogous-upper" ],
        "triad": [ "triad-lower", "triad-upper" ],
      }
      if (nameToAlgo[this.algorithmName]) {
        const algos = nameToAlgo[this.algorithmName]
        algos.forEach( (algorithm) => {

          if (this.palette.querySelector(primary.tagName + `[linked-to-primary='${algorithm}']`)) {
            return
          }
          const newScale = primary.cloneNode(true)
          newScale.removeAttribute("primary")
          newScale.baseColorSwatch.removeAttribute("id") // force the scale to generate one
          newScale.baseColorSwatch.querySelectorAll("input[type=color]").forEach( (input) => {
            input.setAttribute("disabled",true)
          })
          newScale.swatches.forEach( (swatch) => swatch.removeAttribute("derived-from") )
          this.palette.appendChild(newScale)
          newScale.baseColorSwatch.removeAttribute("hex-code")
          newScale.setAttribute("linked-to-primary",algorithm)
          newScale.querySelectorAll(ColorNameComponent.tagName).forEach( (colorName) => {
            if (colorName.getAttribute("color-swatch") == primary.baseColorSwatch.id) {
              colorName.setAttribute("color-swatch",newScale.baseColorSwatch.id)
            }
          })
        })
      }
      else {
        this.logger.warn(`No such algorithm ${this.algorithmName}`)
      }
    }
    else {
      const newScale = primary.cloneNode(true)
      newScale.removeAttribute("primary")
      newScale.baseColorSwatch.removeAttribute("id") // force the scale to generate one
      newScale.swatches.forEach( (swatch) => swatch.removeAttribute("derived-from") )
      this.palette.appendChild(newScale)
      newScale.baseColorSwatch.setAttribute("hex-code", chroma.random().hex())
      newScale.querySelectorAll(ColorNameComponent.tagName).forEach( (colorName) => {
        if (colorName.getAttribute("color-swatch") == primary.baseColorSwatch.id) {
          colorName.setAttribute("color-swatch",newScale.baseColorSwatch.id)
        }
      })
    }
  }

  static tagName = "g-add-color-scale-button"
  static define() {
    customElements.define(this.tagName, AddColorScaleButtonComponent)
  }
}
