import { Component, EventManager } from "brutaldom"

export default class LightDarkButton extends Component {
  wasCreated(cssWhenSelected,cssWhenNotSelected,cssUnknown) {
    EventManager.defineEvents(this,"click")

    this.cssWhenSelected    = cssWhenSelected
    this.cssWhenNotSelected = cssWhenNotSelected
    this.cssUnknown         = cssUnknown
    this.resultSlot         = this.$slot("result")

    this._setUnknown()

    this.element.addEventListener("click", (event) => {
      event.preventDefault()
      this.select()
      this.clickEventManager.fireEvent(event)
    })
  }

  select() {
    this.element.classList.remove(...this.cssUnknown)
    this.element.classList.remove(...this.cssWhenNotSelected)
    this.element.classList.add(...this.cssWhenSelected)
    this.resultSlot.innerHTML = " &check;"
  }

  deselect() {
    this.element.classList.remove(...this.cssUnknown)
    this.element.classList.remove(...this.cssWhenSelected)
    this.element.classList.add(...this.cssWhenNotSelected)
    this.resultSlot.innerHTML = " &times;"
  }

  _setUnknown() {
    this.element.classList.remove(...this.cssWhenSelected)
    this.element.classList.remove(...this.cssWhenNotSelected)
    this.element.classList.add(...this.cssUnknown)
    this.resultSlot.textContent = "?"
  }
}
