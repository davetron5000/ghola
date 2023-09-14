import { Component, EventManager } from "brutaljs"
import RadioButtons from "./RadioButtons"
import ColorInput from "./ColorInput"
import Color from "../Color"

export default class Form extends Component {
  constructor(element, initialData) {
    super(element)
    EventManager.defineEvents(this,"baseColorChanged","numColorsChanged", "numShadesChanged")

    this.colorPicker = new ColorInput(this.$selector("input[type=color]"))
    this.colorPicker.onColorSelected( (color) => this.baseColorChangedEventManager.fireEvent(color) )

    this.numColorsRadioButtons = new RadioButtons(
      this,
      "[name=num-colors]",
      this.numColorsChangedEventManager,
      parseInt
    )
    this.numShadesRadioButtons = new RadioButtons(
      this,
      "[name=num-shades]",
      this.numShadesChangedEventManager,
      parseInt
    )

    if (initialData.color)     { this.color     = initialData.color }
    if (initialData.numColors) { this.numColors = initialData.numColors }
    if (initialData.numShades) { this.numShades = initialData.numShades }
  }

  get numColors()    { return parseInt(this._formData().get("num-colors")) }
  set numColors(val) { this.numColorsRadioButtons.selected = val }

  get color()        { return new Color(this._formData().get("color")) }
  set color(val)     { this.colorPicker.color = val }

  get numShades()    { return parseInt(this._formData().get("num-shades")) }
  set numShades(val) { this.numShadesRadioButtons.selected = val }

  _formData() { return new FormData(this.element) }
}
