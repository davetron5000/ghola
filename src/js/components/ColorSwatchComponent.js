import DerivationAlgorithm from "../derivations/DerivationAlgorithm"
import Logger from "../brutaldom/Logger"

export default class ColorSwatchComponent extends HTMLElement {

  static observedAttributes = [
    "hex-code",
    "derived-from",
    "derivation-algorithm",
    "darken-by",
    "brighten-by",
    "debug",
  ]

  constructor() {
    super()
    this.onInputChangeCallback = (event) => {
      this.setAttribute("hex-code",event.target.value)
    }
    this.onDerivedElementChangeCallback = (event) => {
      let hexCode = event.target.hexCode
      if (hexCode) {
        this._deriveHexCodeFrom(hexCode)
      }
      else {
        this.logger.warn("No hexcode on the derived element: %o",event.target)
        this.removeAttribute("hex-code")
      }
    }
    this.derivationAlgorithm = DerivationAlgorithm.fromString("linear", { throwOnUnknown: true })
    this.logger = Logger.forPrefix(null)
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    this.disconnected = true
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "hex-code") {
      this.hexCode = newValue
      this.dispatchEvent(new CustomEvent("hex-code-change"))
    }
    else if (name == "derived-from") {
      this.derivedFromId = newValue
    }
    else if (name == "darken-by") {
      this.darkenBy = newValue
      this._updateDerivationifNeeded({ whenHexCodeExists: true })
    }
    else if (name == "brighten-by") {
      this.brightenBy = newValue
      this._updateDerivationifNeeded({ whenHexCodeExists: true })
    }
    else if (name == "derivation-algorithm") {
      this.derivationAlgorithm = DerivationAlgorithm.fromString(newValue)
      if (this.derivationAlgorithm) {
        this._updateDerivationifNeeded({ whenHexCodeExists: true })
      }
      else {
        this.logger.warn("derivation-algorithm '%s' is not valid",newValue)
      }
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

  static INPUT_SELECTOR = "input[type=color]"

  _eachInput(f) {
    const inputs = this.querySelectorAll(this.constructor.INPUT_SELECTOR)
    if (inputs.length == 0) {
      this.logger.warn("No elements matching '%s'",this.constructor.INPUT_SELECTOR)
    }
    inputs.forEach(f)
  }

  _eachLabelWithInput(f) {
    this.querySelectorAll("label").forEach( (label) => {
      let input
      if (label.htmlFor) {
        input = this.querySelector(`[id=${label.htmlFor}][type=color]`)
      }
      else {
        input = label.querySelector("input[type=color]")
      }
      if (input) {
        let code = label.querySelector("code")
        if (!code) {
          code = document.createElement("code")
          label.appendChild(code)
        }
        f([label,input,code])
      }
      else {
        this.logger.warn(`Orphaned label inside the element does not wrap nor reference a color input inside the element: %o`,label)
      }
    })
  }

  render() {
    if (this.disconnected) {
      return
    }
    this._eachInput( (element) => {
      element.value = this.hexCode
      if (element.getAttributeNames().indexOf("readonly") != -1) {
        element.setAttribute("disabled",true)
        element.removeEventListener("change", this.onInputChangeCallback)
      }
      else {
        element.removeAttribute("disabled")
        element.addEventListener("change", this.onInputChangeCallback)
        if (this.derivedFromId) {
          this.logger.warn("derived-from-id is set, but a non-readonly input was detected: %o",element)
        }
      }
    })
    if (this.derivedFromId) {
      this._updateDerivationifNeeded({ whenHexCodeExists: false })
    }
    if (this.hexCode) {
      this._eachLabelWithInput( ([label,input,codeElement]) => {
        codeElement.textContent = this.hexCode
      })
    }
    else {
      this._eachLabelWithInput( ([label,input,codeElement]) => {
        codeElement.textContent = ""
      })
    }
  }

  _deriveHexCodeFrom(hexCode) {

    const darken   = this.darkenBy ? parseInt(this.darkenBy) : null
    const brighten = this.brightenBy ? parseInt(this.brightenBy) : null

    if (this.derivationAlgorithm) {
      hexCode = this.derivationAlgorithm.derive(hexCode,{darken: darken, brighten: brighten})
    }
    this.setAttribute("hex-code",hexCode)
  }

  _updateDerivationifNeeded({whenHexCodeExists}) {
    const derivedFromElement = document.getElementById(this.derivedFromId)
    const hexCodeExists = !!this.hexCode

    if (derivedFromElement) {
      derivedFromElement.addEventListener("hex-code-change",this.onDerivedElementChangeCallback)
      this.mostRecentlyDerivedFromElement = derivedFromElement
      if ( (derivedFromElement.hexCode) && (whenHexCodeExists == hexCodeExists) ) {
        this._deriveHexCodeFrom(derivedFromElement.hexCode)
      }
    }
    else {
      if (this.mostRecentlyDerivedFromElement) {
        this.mostRecentlyDerivedFromElement.removeEventListener("hex-code-change",this.onDerivedElementChangeCallback)
        this.mostRecentlyDerivedFromElement = null
      }
      else {
        this.logger.warn("No element with id '%s' to derive a value from (%s)",this.derivedFromId,this.id)
      }
    }
  }

  static tagName = "g-color-swatch"
  static define() {
    customElements.define(this.tagName, ColorSwatchComponent)
  }
}
