import Logger from "../brutaldom/Logger"

import ColorNameComponent from "./ColorNameComponent"
import ColorSwatchComponent from "./ColorSwatchComponent"
import ColorScale from "../color-scales/ColorScale"

export default class PaletteColorComponent extends HTMLElement {

  static observedAttributes = [
    "primary",
    "linked-to-primary",
    "scale-algorithm",
    "debug",
  ]

  constructor() {
    super()
    this.logger = Logger.forPrefix(null)
    this.previewButtonClickListener = () => {
      const detail = {
        colorName: this.colorName,
        colorNameUserOverride: this.colorNameUserOverride,
        colorScale: this.colorScale,
        baseColor: this.baseColorSwatch.hexCode,
      }

      this.dispatchEvent(new CustomEvent("preview", { detail: detail })) 
    }
    this.removeButtonClickListener = () => { 
      const defaultNotPrevented = this.dispatchEvent(new CustomEvent("remove", { bubbles: true, cancelable: true })) 
      if (defaultNotPrevented) {
        this.parentElement.removeChild(this)
      }
    }
    this.unlinkButtonClickListener = () => {
      const defaultNotPrevented = this.dispatchEvent(new CustomEvent("unlink", { bubbles: true, cancelable: true }))
      if (defaultNotPrevented) {
        this.removeAttribute("linked-to-primary")
        if (this.baseColorSwatch) {
          this.baseColorSwatch.removeAttribute("derived-from")
          this.baseColorSwatch.removeAttribute("derivation-algorithm")
          this.baseColorSwatch.querySelectorAll("input[type=color][disabled]").forEach( (input) => {
            input.removeAttribute("disabled")
          })
        }
      }
    }
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    this.disconnected = true
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "primary") {
      this.isPrimary = String(newValue) === ""
      if ( (newValue != "") && (newValue != null) ){
        this.logger.warn("primary should either be present or omitted, not '%s'",newValue)
      }
    }
    else if (name == "linked-to-primary") {
      this.linkedPrimaryAlgorithm = newValue
    }
    else if (name == "scale-algorithm") {
      this.scaleAlgorithm = newValue
    }
    else if (name == "debug") {
      let oldLogger
      if (!oldValue && newValue) {
        oldLogger = this.logger
      }
      const prefix = newValue == "" ? this.id : newValue
      this.logger = Logger.forPrefix(prefix)
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
    this._configureButtons()
    this._configureLink()
    this._configureScale()
  }

  _configureScale() {
    const swatches = Array.from(this.querySelectorAll(ColorSwatchComponent.tagName))
    if (swatches.length % 2 == 0) {
      this.logger.warn("Cannot set up a scale with an even number of swatches")
      return
    }

    const middle = (swatches.length - 1) / 2

    this.baseColorSwatch = swatches[middle]
    let id = this.baseColorSwatch.id
    if (!id) {
      id = `${ColorSwatchComponent.tagName}-${crypto.randomUUID()}-generated`
      this.baseColorSwatch.id = id
    }
    
    if (this.linkedPrimaryElement) {
      if (this.linkedPrimaryElement.baseColorSwatch) {
        this.baseColorSwatch.setAttribute("derived-from",this.linkedPrimaryElement.baseColorSwatch.id)
        if (this.linkedPrimaryAlgorithm) {
          this.baseColorSwatch.setAttribute("derivation-algorithm",this.linkedPrimaryAlgorithm)
        }
      }
      else {
        this.logger.warn("Linked g-palette-color-scale (%s) has no base color, so we cannot link to it",this.linkedPrimaryElement.id)
      }
    }

    const algorithm = ColorScale.fromString(this.scaleAlgorithm)

    if (algorithm.isFallback && this.scaleAlgorithm) {
      this.logger.warn(`No such algorithm for derive-color-scale '${this.scaleAlgorithm}'`)
    }
    swatches.forEach( (swatch,index) => {
      if (index != middle) {
        if (!swatch.getAttribute("derived-from")) {
          swatch.setAttribute("derived-from",id)
        }
        if (!swatch.getAttribute("derivation-algorithm")) {
          swatch.setAttribute("derivation-algorithm","brightness")
        }
        const [ attribute, value ] = algorithm.valueFor(index,swatches.length)
        if (attribute && !swatch.getAttribute(attribute)) {
          swatch.setAttribute(attribute,`${Math.floor(value)}%`)
        }
      }
    })
  }

  _configureButtons() {
    const enable = (element) => element.removeAttribute("disabled")
    const disable = (element) => element.setAttribute("disabled",true)

    if (this.isPrimary) {
      this._eachPreviewElement(enable)
      this._eachUnlinkElement(disable)
      this._eachRemoveElement(disable)
    }
    else if ( this.linkedPrimaryAlgorithm ){
      this._eachPreviewElement(enable)
      this._eachUnlinkElement(enable)
      this._eachRemoveElement(enable)
    }
    else {
      this._eachPreviewElement(enable)
      this._eachUnlinkElement(disable)
      this._eachRemoveElement(enable)
    }
    this._eachPreviewElement( (e) => e.addEventListener("click", this.previewButtonClickListener) )
    this._eachUnlinkElement( (e) => e.addEventListener("click", this.unlinkButtonClickListener) )
    this._eachRemoveElement( (e) => e.addEventListener("click", this.removeButtonClickListener) )
  }

  _configureLink() {
    if (this.linkedPrimaryAlgorithm) {
      this.linkedPrimaryElement = this.parentElement ? this.parentElement.querySelector(`${this.constructor.tagName}[primary]`) : null
      if (!this.linkedPrimaryElement) {
        if (this.parentElement) {
          this.logger.warn("linked-to-primary had a value ('%s') but no sibling is marked as primary: %o",this.linkedPrimaryAlgorithm,this.parentElement.querySelectorAll("g-palette-color-scale").length)
        }
        else {
          this.logger.warn("linked-to-primary had a value ('%s') but we have no parent element",this.linkedPrimaryAlgorithm)
        }
      }
    }
  }
  _eachPreviewElement(f) { this.querySelectorAll("[data-preview]").forEach(f) }
  _eachUnlinkElement(f) { this.querySelectorAll("[data-unlink]").forEach(f) }
  _eachRemoveElement(f) { this.querySelectorAll("[data-remove]").forEach(f) }


  get colorName() {
    const colorName = this.querySelector(ColorNameComponent.tagName)
    if (colorName) {
      return colorName.name
    }
    else {
      return null
    }
  }
  get colorNameUserOverride() {
    const colorName = this.querySelector(ColorNameComponent.tagName)
    return colorName && colorName.userOverride
  }
  get colorScale() {
    return Array.from(this.querySelectorAll(ColorSwatchComponent.tagName)).map( (element) => {
      return element.hexCode
    })
  }

  static tagName = "g-palette-color-scale"
  static define() {
    customElements.define(this.tagName, PaletteColorComponent)
  }
}
