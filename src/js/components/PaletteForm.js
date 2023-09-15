import { Component, EventManager } from "brutaljs"
import RadioButtons from "./RadioButtons"
import Select from "./Select"
import ColorInput from "./ColorInput"
import Color from "../Color"


export default class PaletteForm extends Component {
  constructor(element, initialData) {
    super(element)
    EventManager.defineEvents(this,
                              "baseColorChanged",
                              "numColorsChanged",
                              "numShadesChanged",
                              "scaleModelChanged",
                              "colorWheelChanged")

    this.colorPicker = new ColorInput(this.$selector("input[name=color]"))
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
    this.modelSelect = new Select(
      this,
      "[name=scale-model]",
      this.scaleModelChangedEventManager
    )
    this.colorWheelSelect = new Select(
      this,
      "[name=color-wheel]",
      this.colorWheelChangedEventManager
    )


    if (initialData.color)      { this.color      = initialData.color }
    if (initialData.numColors)  { this.numColors  = initialData.numColors }
    if (initialData.numShades)  { this.numShades  = initialData.numShades }
    if (initialData.scaleModel) { this.scaleModel = initialData.scaleModel }
    if (initialData.colorWheel) { this.colorWheel = initialData.colorWheel }
  }

  get numColors()    { return parseInt(this._formData().get("num-colors")) }
  set numColors(val) { this.numColorsRadioButtons.selected = val }

  get color()        { return new Color(this._formData().get("color")) }
  set color(val)     { this.colorPicker.color = val }

  get numShades()    { return parseInt(this._formData().get("num-shades")) }
  set numShades(val) { this.numShadesRadioButtons.selected = val }

  get scaleModel()    { return this._formData().get("scale-model") }
  set scaleModel(val) { this.modelSelect.selected = val }

  get colorWheel()    { return this._formData().get("color-wheel") }
  set colorWheel(val) { this.colorWheelSelect.selected = val }

  _formData() { return new FormData(this.element) }
}
