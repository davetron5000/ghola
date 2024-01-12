import HasEvents from "../brutaldom/HasEvents"
import NonCustomElement from "../brutaldom/NonCustomElement"

class Input extends NonCustomElement {

  static events = {
    "change": {}
  }

  constructor(element) {
    super(element)
    this.element.addEventListener("change", (event) => {
      this.dispatchChange(event.target.value)
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }
}
HasEvents.mixInto(Input)
export default Input
