import { Component, EventManager } from "brutaljs"
import Color from "../Color"

export default class ColorInput extends Component {
  constructor(element) {
    super(element)
    EventManager.defineEvents(this,"colorSelected")
    this.colorSelectedEventManager.debounce(200)
    this.element.addEventListener("change", (event) => {
      this.colorSelectedEventManager.fireEvent(new Color(element.value))
    })
  }

  enable() { this.element.disabled = false }
  disable() { this.element.disabled = true }


  set color(val) {
    this._color = val
    this.element.value = val ? val.hex() : null
  }

  get color() {
    return this._color
  }

}
