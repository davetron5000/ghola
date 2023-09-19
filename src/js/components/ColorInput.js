import { Component, EventManager } from "brutaldom"
import Color from "../Color"

export default class ColorInput extends Component {
  wasCreated(filter) {
    this.filter = filter || ((x) => { return x })
    EventManager.defineEvents(this,"colorSelected")
    this.colorSelectedEventManager.debounce(200)
    this.element.addEventListener("change", (event) => {
      const filteredHex = this.filter(this.element.value)
      if (filteredHex != this.element.value) {
        this.element.value = filteredHex
      }
      this.colorSelectedEventManager.fireEvent(new Color(filteredHex))
    })
  }

  enable() { this.element.disabled = false }
  disable() { this.element.disabled = true }


  set color(val) {
    this._color = val
    this.element.value = val ? this.filter(val.hex()) : null
  }

  get color() {
    return this._color
  }

}
