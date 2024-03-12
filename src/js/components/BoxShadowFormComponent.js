import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class BoxShadowFormComponent extends BaseCustomElement {

  static tagName = "g-box-shadow-form"
  static observedAttributes = [
    "show-warnings",
  ]

  constructor() {
    super()
    this.inputListener = (event) => {
      this.dispatchEvent(new CustomEvent("change", { detail: event }))
    }
    this.changeListeners = new Set()
  }

  render() {
    this.eachElement( (element) => {
      element.addEventListener("input", this.inputListener)
    })
  }

  eachElement(f) {
    const form = this.querySelector("form")
    if (!form) {
      this.logger.warn("Could not find a form element")
      return
    }

    Array.from(form.elements).forEach( (element) => f(element) )
    this.querySelectorAll("g-xy-input").forEach( (element) => f(element) )
  }

  linkElements(eventListener) {
    this.addEventListener("change",eventListener)
    if (!this.changeListeners.has(eventListener)) {
      this.changeListeners.add(eventListener)
      this.eachElement( (element) => {
        eventListener(new CustomEvent("change",{ detail: { target: element }}))
      })
    }

  }
}
