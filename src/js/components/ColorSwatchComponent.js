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

  static HEX_CODE_CHANGE_EVENT_NAME = "hex-code-change"

  constructor() {
    super()
    this.onInputChangeCallback = (event) => {
      this.setAttribute("hex-code",event.target.value)
    }
    this.onDerivedElementChangeCallback = (event) => {
      if (event.target != this.derivedFromElement) {
        this.logger.warn("Got an eevent from not our derived")
      }
      this._deriveHexCodeFromSwatch(event.target)
    }
    this.derivationAlgorithm = DerivationAlgorithm.fromString("brightness", { throwOnUnknown: true })
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
      this._dispatchHexcodeChanged()
    }
    else if (name == "derived-from") {
      if (this.derivedFromElement) {
        this.derivedFromElement.removeEventListener(this.hexCodeChangedEventName,this.onDerivedElementChangeCallback)
      }
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
      else if (!!newValue) {
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

  static INPUT_SELECTOR      = "input[type=color]"
  static DATA_COLOR_SELECTOR = "[data-color]"

  _eachInput(f) {
    const elements = this.querySelectorAll(this.constructor.INPUT_SELECTOR)
    elements.forEach(f)
    return elements.length
  }
  _eachDataColor(f) {
    const elements = this.querySelectorAll(this.constructor.DATA_COLOR_SELECTOR)
    elements.forEach(f)
    return elements.length
  }

  _eachCodeElementInsideRelevantLabel(f) {
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
        f(code)
      }
      else {
        this.logger.warn(`Orphaned label inside the element does not wrap nor reference a color input inside the element: %o`,label)
      }
    })
    this.querySelectorAll("[data-hexcode]").forEach( (hexCode) => {
      let code = hexCode.querySelector("code")
      if (!code) {
        code = document.createElement("code")
        hexCode.appendChild(code)
      }
      f(code)
    })
  }

  render() {
    if (this.disconnected) {
      return
    }
    const numInputs = this._eachInput( (element) => {
      element.value = this.hexCode
      element.addEventListener("change", this.onInputChangeCallback)
      const disabled = element.getAttributeNames().indexOf("disabled") != -1
      if (!disabled) {
        if (this.derivedFromId) {
          this.logger.warn("derived-from-id is set, but an enabled input was detected: %o",element)
        }
      }
    })
    const numDataColors = this._eachDataColor( (element) => {
      element.style.backgroundColor = this.hexCode
    })

    if ( (numDataColors == 0) && (numInputs == 0) ) {
      this.logger.warn("There were no <input type=color> nor [data-color] elements found")
    }
    if (this.derivedFromId) {
      this._updateDerivationifNeeded({ whenHexCodeExists: false })
    }
    if (this.hexCode) {
      this._eachCodeElementInsideRelevantLabel( (codeElement) => {
        codeElement.textContent = this.hexCode
      })
    }
    else {
      this._eachCodeElementInsideRelevantLabel( (codeElement) => {
        codeElement.textContent = ""
      })
    }
  }

  _deriveHexCodeFromSwatch(element) {
    let hexCode = element.hexCode
    if (hexCode) {
      this._deriveHexCodeFrom(hexCode)
    }
    else {
      this.logger.warn("No hexcode on the derived element: %o",event.target)
      this.removeAttribute("hex-code")
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

  get derivedFromElement() {
    return document.getElementById(this.derivedFromId)
  }

  _updateDerivationifNeeded({whenHexCodeExists}) {
    const derivedFromElement = this.derivedFromElement
    const hexCodeExists = !!this.hexCode

    if (derivedFromElement) {
      if (derivedFromElement.tagName.toLowerCase() == this.constructor.tagName) {
        derivedFromElement.addEventListener(this.hexCodeChangedEventName,this.onDerivedElementChangeCallback)
        if ( (derivedFromElement.hexCode) && (whenHexCodeExists == hexCodeExists) ) {
          this._deriveHexCodeFrom(derivedFromElement.hexCode)
        }
      }
      else {
        this.logger.warn("Derived element has id '%s', but this is a %s, not a %s",this.derivedFromId,derivedFromElement.tagName,this.constructor.tagName)
      }
    }
  }

  get hexCodeChangedEventName() { return this.constructor.HEX_CODE_CHANGE_EVENT_NAME }

  _dispatchHexcodeChanged() {
    this.dispatchEvent(new CustomEvent(this.hexCodeChangedEventName))
  }


  get forTesting() {
    return {
      dispatchHexCodeChanged: () => {
        this._dispatchHexcodeChanged()
      }
    }
  }


  static tagName = "g-color-swatch"
  static define() {
    customElements.define(this.tagName, ColorSwatchComponent)
  }
}
