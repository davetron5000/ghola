import chroma from "chroma-js"
import Logger from "../brutaldom/Logger"

const namesBasedOnHue = [
  [ "Red"    , [ 0   , 21  ] ] ,
  [ "Orange" , [ 21  , 41  ] ] ,
  [ "Yellow" , [ 41  , 74  ] ] ,
  [ "Green"  , [ 74  , 167 ] ] ,
  [ "Blue"   , [ 167 , 259 ] ] ,
  [ "Purple" , [ 259 , 333 ] ] ,
  [ "Red"    , [ 333 , 360 ] ] ,
]

export default class ColorNameComponent extends HTMLElement {

  static observedAttributes = [
    "color-swatch",
    "debug",
  ]

  constructor() {
    super()
    this.logger = Logger.forPrefix(null)
    this.updateNameEventListener = () => {
      this.render()
    }
    this.inputChangeListener = (event) => {
      const value = event.target.value
      if (value && String(value).trim() != "") {
        event.target.dataset.userOverride = true
      }
      else {
        delete event.target.dataset.userOverride
      }
      this.render()
    }
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    this.disconnected = true
    if (this.colorSwatch) {
      this.colorSwatch.removeEventListener("hex-code-change",this.updateNameEventListener)
    }
    if (this.input) {
      this.input.removeEventListener("change",this.inputChangeListener)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "color-swatch") {
      const component = document.getElementById(newValue)
      if (component != this.colorSwatch) {
        if (this.colorSwatch) {
          this.colorSwatch.removeEventListener("hex-code-change",this.updateNameEventListener)
        }
        if (component) {
          this.updateNameEventListener.id = `listener-${this.id}`
          component.addEventListener("hex-code-change",this.updateNameEventListener)
        }
      }
      this.colorSwatch = component
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

  _input() {
    const inputs = this.querySelectorAll("input[type=text]")
    if (inputs.length > 1) {
      this.logger.warn("There is more than one input - only the first one found will be used")
    }
    return inputs[0]
  }

  render() {
    if (this.disconnected) {
      return
    }
    const input = this._input()
    if (this.input != input) {
      if (this.input) {
        this.input.removeEventListener("change",this.inputChangeListener)
      }
      if (input) {
        input.addEventListener("change",this.inputChangeListener)
      }
      this.input = input
    }

    if (input && !input.dataset.userOverride) {
      if (this.colorSwatch && this.colorSwatch.hexCode) {
        input.value = this._name(this.colorSwatch.hexCode)
      }
    }
  }

  get name() {
    const input = this._input()
    if (input) {
      return input.value
    }
    else {
      return null
    }

  }
  get userOverride() {
    const input = this._input()
    if (input) {
      return input.dataset.userOverride
    }
    else {
      return false
    }
  }

  _name(hexCode) {
    const hue = chroma(hexCode).hsl()[0]
    if (isNaN(hue)) {
      return "Gray"
    }
    const nameEntry = namesBasedOnHue.find( ([name,[low,high]]) => {
      if ((hue >= low) && (hue <= high)) {
        return true
      }
    })
    if (!nameEntry) {
      throw `Something is wrong: ${hexCode}'s hue of '${hue}' was not in namesBasedOnHue`
    }
    return nameEntry[0]
  }

  static tagName = "g-color-name"
  static define() {
    customElements.define(this.tagName, ColorNameComponent)
  }
}
