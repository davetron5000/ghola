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

class ColorSelector extends Component {
  constructor(element,filter) {
    super(element)
    EventManager.defineEvents(this,"colorSelected")
    this.colorPicker = new ColorInput(this.$selector("input[type=color]"), filter)
    this.hexCode     = new ColorHexCode(this.$("hex"))
    this.name        = new ColorName(this.$("name"))

    this.colorPicker.onColorSelected( (color) => this.hexCode.color = color )
    this.colorPicker.onColorSelected( (color) => this.name.color = color )
    this.colorPicker.onColorSelected( (color) => this.colorSelectedEventManager.fireEvent(color) )
  }

  set color(val) {
    if (!val) {
      throw `WTF`
    }
    this.colorPicker.color = val
    this.hexCode.color     = val
    this.name.color        = val
  }
}

class DisableableColorSelector extends ColorSelector {
  constructor(element, filter, enabled) {
    super(element,filter)
    this.checkedEventManager   = new EventManager("checked")
    this.uncheckedEventManager = new EventManager("unchecked")
    this.checkbox = new Checkbox(this,"input[type=checkbox]",
      this.checkedEventManager,
      this.uncheckedEventManager)

    if (enabled) {
      this.checkbox.checked = true
      this._enable()
    }
    else {
      this.checkbox.checked = false
      this._disable()
    }

    this.checkedEventManager.addListener(() => {
      this.colorSelectedEventManager.fireEvent(this.colorPicker.color)
      this._enable()
    })
    this.uncheckedEventManager.addListener(() => {
      this.colorSelectedEventManager.fireEvent(null)
      this._disable()
    })
  }
  _enable() {
    this.element.classList.remove("gray")
    this.colorPicker.enable()
  }
  _disable() {
    this.element.classList.add("gray")
    this.colorPicker.disable()
  }
}

export default class PaletteForm extends Component {
  static logContext = "ghola"

  constructor(element, initialData) {
    super(element)
    EventManager.defineEvents(this,
                              "baseColorChanged",
                              "secondaryColorChanged",
                              "numColorsChanged",
                              "numShadesChanged",
                              "scaleModelChanged",
                              "colorWheelChanged")

    this.colorSelector = new ColorSelector(
      this.$selector("label[for='color']"),
      (hex) => {
        let color = new Color(hex)
        console.log(`Got ${hex}`)
        if (color.isGray()) {
          color = Color.fromHSL(199,0.1,color.lightness({ model: "hsl" }))
        }
        console.log(`Returning ${color.hex()}`)
        return color.hex()
      }
    )
    this.secondaryColorSelector = new DisableableColorSelector(
      this.$selector("label[for='secondary-color']"),
      (hex) => {
        let color = new Color(hex)
        if (color.isGray()) {
          color = Color.fromHSL(34,0.1,color.lightness({ model: "hsl" }))
        }
        return color.hex()
      },
      initialData.secondaryColorChecked
    )

    this.colorSelector.onColorSelected(this.baseColorChangedEventManager)
    this.secondaryColorSelector.onColorSelected(this.secondaryColorChangedEventManager)

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


    if (initialData.color)          { this.color          = initialData.color }
    if (initialData.secondaryColor) { this.secondaryColor = initialData.secondaryColor }
    if (initialData.numColors)      { this.numColors      = initialData.numColors }
    if (initialData.numShades)      { this.numShades      = initialData.numShades }
    if (initialData.scaleModel)     { this.scaleModel     = initialData.scaleModel }
    if (initialData.colorWheel)     { this.colorWheel     = initialData.colorWheel }
  }

  get numColors()         { return parseInt(this._formData().get("num-colors")) }
  set numColors(val)      { this.numColorsRadioButtons.selected = val }

  get color()             { return new Color(this._formData().get("color")) }
  set color(val)          { this.colorSelector.color = val }

  get secondaryColor()    { 
    if (this._formData().get("secondary-color")) {
      return new Color(this._formData().get("secondary-color"))
    }
    else {
      return null
    }
  }
  set secondaryColor(val) { this.secondaryColorSelector.color = val }

  get numShades()         { return parseInt(this._formData().get("num-shades")) }
  set numShades(val)      { this.numShadesRadioButtons.selected = val }

  get scaleModel()        { return this._formData().get("scale-model") }
  set scaleModel(val)     { this.modelSelect.selected = val }

  get colorWheel()        { return this._formData().get("color-wheel") }
  set colorWheel(val)     { this.colorWheelSelect.selected = val }

  _formData() { return new FormData(this.element) }
}
