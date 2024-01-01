import HasEvents from "../brutaldom/HasEvents"
import NonCustomElement from "../brutaldom/NonCustomElement"
import Hideable from "./Hideable"

class Button extends NonCustomElement {

  static events = {
    "click": {}
  }

  constructor(element) {
    super(element)
    this.element.addEventListener("click", (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.dispatchClick()
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }
}
HasEvents.mixInto(Button)
Hideable.mixInto(Button)
export default Button
