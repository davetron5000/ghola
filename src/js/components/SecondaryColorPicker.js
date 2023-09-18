import { Component, EventManager } from "brutaljs"
import RadioButtons from "./RadioButtons"
import Select from "./Select"
import ColorInput from "./ColorInput"
import Color from "../Color"
import Checkbox from "./Checkbox"

class ColorHexCode extends Component {
  set color(val) {
    this.element.textContent = val ? val.hex() : ""
  }
}
class ColorName extends Component {
  set color(val) {
    this.element.textContent = val ? val.name() : ""
  }
}

export default class SecondaryColorPicker extends Component {
  constructor(element, form) {
    super(element)
    this.secondaryColorChecked   = new EventManager("secondaryColorChecked")
    this.secondaryColorUnchecked = new EventManager("secondaryColorUnchecked")

    this.secondaryColorPicker   = new ColorInput(this.$selector("input[name=secondary-color]"))
    this.secondaryColorCheckbox = new Checkbox(form,"label[for='secondary-color'] input[type=checkbox]",
      this.secondaryColorChecked,
      this.secondaryColorUnchecked)
    this.secondaryHexCode       = new ColorHexCode(this.$selector("label[for='secondary-color'] [data-hex]"))
    this.secondaryName          = new ColorName(this.$selector("label[for='secondary-color'] [data-name]"))
    this.secondaryColorComponent = new Component(this.$selector("label[for='secondary-color']"))

    this.secondaryColorChecked.addListener(() => {
      this.secondaryColorChangedEventManager.fireEvent(this.secondaryColorPicker.color)
      this.secondaryColorComponent.element.classList.remove("gray")
    })
    this.secondaryColorUnchecked.addListener(() => {
      this.secondaryColorChangedEventManager.fireEvent(null)
      this.secondaryColorComponent.element.classList.add("gray")
    })
    this.secondaryColorPicker.onColorSelected( (color) => this.secondaryColorChangedEventManager.fireEvent(color) )
    this.secondaryColorPicker.onColorSelected( (color) => this.secondaryHexCode.color = color )
    this.secondaryColorPicker.onColorSelected( (color) => this.secondaryName.color = color )
  }
}
