import Logger from "../brutaldom/Logger"

import ColorNameComponent from "./ColorNameComponent"
import ColorSwatchComponent from "./ColorSwatchComponent"

class LinearGradient {
  valueFor(index,numSwatches) {
    const middle = (numSwatches - 1) / 2
    if (index < middle) {
      const step = index
      const totalSteps = middle
      const min = 40
      const max = 80

      const percentAlongRange = step / (totalSteps - 1)
      const percentage = Math.floor(max - (percentAlongRange * (max - min)))

      return [ "darken-by", percentage ]
    }
    else {
      const step = (numSwatches - 1) - index
      const totalSteps = middle
      const min = 30
      const max = 90

      const percentAlongRange = step / (totalSteps - 1)
      const percentage = Math.floor(max - (percentAlongRange * (max - min)))
      return [ "brighten-by", percentage ]
    }
  }
}

class ExponentialGradient {
  _quarticBabyYeah(x) {
    /*
     * https://mycurvefit.com
       -0.75               -90        
       -0.5                -60        
       -0.25               -40        
        0                    0        
        0.25                60        
        0.5                 80        
        0.75                98
    */
    const a =    4.0692
    const b =  175.3016
    const c =   51.8788
    const d =  -92.4444
    const e =  -93.0909

    return  a                  +
           (b * x)             +
           (c * Math.pow(x,2)) +
           (d * Math.pow(x,3)) +
           (e * Math.pow(x,4))
  }

  valueFor(index,numSwatches) {
    const middle = (numSwatches - 1) / 2
    const step = index + 1
    const adjustedMiddle = middle + 1
    const adjustedStep = step - adjustedMiddle
    const percentAlongRange = adjustedStep / adjustedMiddle
    
    const percentage = this._quarticBabyYeah(percentAlongRange)

    if (index < middle) {
      return [ "darken-by", -1 * percentage ]
    }
    else {
      return [ "brighten-by", percentage ]
    }
  }
}
class NoGradient {
  valueFor() {
    return []
  }
}

export default class PaletteColorComponent extends HTMLElement {

  static observedAttributes = [
    "primary",
    "linked-to",
    "linked-to-primary",
    "as-color-scale",
    "debug",
  ]

  constructor() {
    super()
    this.logger = Logger.forPrefix(null)
    this.previewButtonClickListener = () => { this.dispatchEvent(new CustomEvent("preview")) }
    this.removeButtonClickListener = () => { 
      const defaultNotPrevented = this.dispatchEvent(new CustomEvent("remove", { bubbles: true, cancelable: true })) 
      if (defaultNotPrevented) {
        this.parentElement.removeChild(this)
      }
    }
    this.unlinkButtonClickListener = () => {
      const defaultNotPrevented = this.dispatchEvent(new CustomEvent("unlink", { bubbles: true, cancelable: true }))
      if (defaultNotPrevented) {
        this.removeAttribute("linked-to")
        this.removeAttribute("linked-to-primary")
      }
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
    if (name == "primary") {
      this.isPrimary = String(newValue) === ""
      if ( (newValue != "") && (newValue != null) ){
        this.logger.warn("primary should either be present or omitted, not '%s'",newValue)
      }
    }
    else if (name == "linked-to") {
      this.linkedToId = newValue
    }
    else if (name == "linked-to-primary") {
      this.linkedPrimary = true
    }
    else if (name == "as-color-scale") {
      this.colorScaleAlgorithm = newValue
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
    if (!this.colorScaleAlgorithm) {
      return
    }

    const swatches = Array.from(this.querySelectorAll(ColorSwatchComponent.tagName))
    if (swatches.length % 2 == 0) {
      this.logger.warn("Cannot set up a scale with an even number of swatches")
      return
    }

    const middle = (swatches.length - 1) / 2
    let id = swatches[middle].id
    if (!id) {
      id = `${ColorSwatchComponent.tagName}-${crypto.randomUUID()}`
      swatches[middle].id = id
    }

    let algorithmKlass

    if (this.colorScaleAlgorithm == "linear") {
      algorithmKlass = LinearGradient
    }
    else if (this.colorScaleAlgorithm == "exponential") {
      algorithmKlass = ExponentialGradient
    }
    else {
      this.logger.warn(`No such as-color-scale algorithm '${this.colorScaleAlgorithm}'`)
      algorithmKlass = NoGradient
    }
    const algorithm = new algorithmKlass()
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
    else if ( (this.linkedToId) || (this.linkedPrimary) ){
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

    let linkedToElement = null
    if (this.linkedToId) {
      linkedToElement = document.getElementById(this.linkedToId)
      if (!linkedToElement) {
        this.logger.warn("linked-to is '%s' but no element in the document has that id",this.linkedToId)
      }
    }
    else if (this.linkedPrimary) {
      linkedToElement = this.connected ? this.parentElement.querySelector(`${this.constructor.tagName}[primary]`) : null
      if (!linkedToElement) {
        this.logger.warn("linked-to-primary is '%s' but no sibling is marked as primary",this.linkedPrimary)
      }
    }
    if (this.linkedToId && this.linkedPrimary) {
      this.logger.warn("linked-to and linked-to-primary are both set - behavior is undefined")
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

  static tagName = "g-palette-color"
  static define() {
    customElements.define(this.tagName, PaletteColorComponent)
  }
}
