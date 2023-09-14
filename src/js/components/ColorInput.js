import { Component, EventManager } from "brutaljs"
import Color from "../Color"

export default class ColorInput extends Component {
  constructor(element) {
    super(element)
    EventManager.defineEvents(this,"colorSelected")
    this.element.addEventListener("change", (event) => {
      this.colorSelectedEventManager.fireEvent(new Color(element.value))
    })
  }

  set color(val) {
    this.element.value = val.hex()
  }
}
