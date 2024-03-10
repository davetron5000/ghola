import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class BoxShadowFormComponent extends BaseCustomElement {

  static tagName = "g-box-shadow-form"
  static observedAttributes = [
    "linked-to",
    "show-warnings",
  ]

  linkedToChangedCallback({newValue}) {
    this.linkedToElementId = newValue
  }

  constructor() {
    super()
    this.changeListener = (event) => {
      const linkedElement = document.getElementById(this.linkedToElementId)
      if (!linkedElement) {
        this.logger.warn(`No element with id '${this.linkedToElementId}' found`)
        return
      }
      if (event.target.type == "checkbox") {
        if (event.target.checked) {
          linkedElement.setAttribute(event.target.name,true)
        }
        else {
          linkedElement.removeAttribute(event.target.name)
        }
      }
      else if (event.detail && event.detail.x && event.detail.y) {
        linkedElement.setAttribute("offset-x",event.detail.x)
        linkedElement.setAttribute("offset-y",event.detail.y)
      }
      else {
        linkedElement.setAttribute(event.target.name,event.target.value)
      }
    }
  }

  render() {
    const form = this.querySelector("form")
    if (!form) {
      this.logger.warn("Could not find a form element")
      return
    }

    Array.from(form.elements).forEach( (element) => {
      element.addEventListener("input", this.changeListener)
    })
    this.querySelectorAll("g-xy-input").forEach( (element) => {
      element.addEventListener("input", this.changeListener)
    })
  }
}
