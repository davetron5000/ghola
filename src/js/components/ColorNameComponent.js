import BaseCustomElement from "../brutaldom/BaseCustomElement"
import Color from "../Color"

export default class ColorNameComponent extends BaseCustomElement {

  static tagName = "g-color-name"
  static observedAttributes = [
    "color-swatch",
    "show-warnings",
  ]

  static NAMES_BASED_ON_HUE = [
    [ "Red"    , [ 0   , 21  ] ] ,
    [ "Orange" , [ 21  , 41  ] ] ,
    [ "Yellow" , [ 41  , 74  ] ] ,
    [ "Green"  , [ 74  , 167 ] ] ,
    [ "Blue"   , [ 167 , 259 ] ] ,
    [ "Purple" , [ 259 , 333 ] ] ,
    [ "Red"    , [ 333 , 360 ] ] ,
  ]


  constructor() {
    super()
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

  onDisconnected() {
    if (this.colorSwatch) {
      this.colorSwatch.removeEventListener("hex-code-change",this.updateNameEventListener)
    }
    if (this.input) {
      this.input.removeEventListener("change",this.inputChangeListener)
    }
  }

  colorSwatchChangedCallback({newValue}) {
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

  _input() {
    const inputs = this.querySelectorAll("input[type=text]")
    if (inputs.length > 1) {
      this.logger.warn("There is more than one input - only the first one found will be used")
    }
    return inputs[0]
  }

  render() {
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

  overrideColorName(newName) {
    const input = this._input()
    if (input) {
      input.dataset.userOverride = true
      input.value = newName
    }
  }
  restoreDefaultColorName() {
    const input = this._input()
    if (input) {
      delete input.dataset.userOverride
      input.value = ""
      this.render()
    }
  }


  _name(hexCode) {
    const [hue,saturation,l] = Color.fromHexCode(hexCode).hsl()
    if (isNaN(hue) || (saturation == 0)) {
      return "Gray"
    }
    const nameEntry = this.constructor.NAMES_BASED_ON_HUE.find( ([name,[low,high]]) => {
      if ((hue >= low) && (hue <= high)) {
        return true
      }
    })
    if (!nameEntry) {
      throw `Something is wrong: ${hexCode}'s hue of '${hue}' was not in namesBasedOnHue`
    }
    return nameEntry[0]
  }
}
