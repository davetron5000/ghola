import BaseCustomElement from "../brutaldom/BaseCustomElement"
import DerivationAlgorithm from "../derivations/DerivationAlgorithm"

export default class ColorSwatchComponent extends BaseCustomElement {

  static tagName = "g-color-swatch"
  static observedAttributes = [
    "hex-code",
    "derived-from",
    "derivation-algorithm",
    "darken-by",
    "brighten-by",
    "show-warnings",
    "default-link-context",
  ]

  static HEX_CODE_CHANGE_EVENT_NAME = "hex-code-change"

  constructor() {
    super()
    this.onInputChangeCallback = (event) => {
      this.setAttribute("hex-code",event.target.value)
    }
    this.onDerivedElementChangeCallback = (event) => {
      if (event.target != this.derivedFromElement) {
        this.logger.warn("Got an event from not our derived")
      }
      this._deriveHexCodeFromSwatch(event.target)
    }
    this.derivationAlgorithm = DerivationAlgorithm.fromString("brightness", { throwOnUnknown: true })
  }

  hexCodeChangedCallback({newValue}) {
    this.hexCode = newValue
    this._dispatchHexcodeChanged()
  }

  derivedFromChangedCallback({newValue}) {
    if (this.derivedFromElement) {
      this.derivedFromElement.removeEventListener(this.hexCodeChangedEventName,this.onDerivedElementChangeCallback)
    }
    this.derivedFromId = newValue
  }

  defaultLinkContextChangedCallback({newValue}) {
    this.defaultLinkContext = newValue
  }

  darkenByChangedCallback({newValue}) {
    this.darkenBy = newValue
    this._updateDerivationifNeeded({ whenHexCodeExists: true })
  }

  brightenByChangedCallback({newValue}) {
    this.brightenBy = newValue
    this._updateDerivationifNeeded({ whenHexCodeExists: true })
  }

  derivationAlgorithmChangedCallback({newValue}) {
    this.derivationAlgorithm = DerivationAlgorithm.fromString(newValue)
    if (this.derivationAlgorithm) {
      this._updateDerivationifNeeded({ whenHexCodeExists: true })
    }
    else if (!!newValue) {
      this.logger.warn("derivation-algorithm '%s' is not valid",newValue)
    }
  }

  static INPUT_SELECTOR      = "input"
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
    this._eachLinkContext( (element) => {
      if (this.defaultLinkContext) {
        element.textContent = this.defaultLinkContext
      }
      else {
        element.innerHTML = "&nbsp;" 
      }
    })
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

  _eachLinkContext(f) {
    this.querySelectorAll("[data-link-context]").forEach(f)
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
        this._eachLinkContext( (element) => element.textContent = this.derivationAlgorithm.humanName )
      }
      else {
        this.logger.warn("Derived element has id '%s', but this is a %s, not a %s",this.derivedFromId,derivedFromElement.tagName,this.constructor.tagName)
      }
    }
  }

  get hexCodeChangedEventName() { return this.constructor.HEX_CODE_CHANGE_EVENT_NAME }

  _dispatchHexcodeChanged() {
    this.dispatchEvent(new CustomEvent(this.hexCodeChangedEventName, { cancelable: false, bubbles: true }))
  }


  get forTesting() {
    return {
      dispatchHexCodeChanged: () => {
        this._dispatchHexcodeChanged()
      }
    }
  }
}
