import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class PreviewTextComponent extends BaseCustomElement {

  static tagName = "g-preview-text"
  static observedAttributes = [
    "background-color",
    "text-color",
    "show-warnings",
    "form",
  ]

  formChangedCallback({newValue}) {
    this.formName = newValue
  }

  constructor() {
    super()
    this.formElementChangeListener = (event) => {
      this._updateColors(event.target)
    }
  }

  backgroundColorChangedCallback({newValue}) {
    this.backgroundColor = newValue
  }

  textColorChangedCallback({newValue}) {
    this.textColor = newValue
  }

  get form() {
    if (!this.formName) {
      return null
    }
    return document.querySelector(`form[name='${this.formName}']`)
  }

  render() {
    if (this.form) {
      Array.from(this.form.elements).forEach( (element) => {
        element.addEventListener("change",this.formElementChangeListener)
      })
    }
    if (this.backgroundColor) {
      this.style.backgroundColor = this.backgroundColor
    }
    else {
      this.style.backgroundColor = "transparent"
    }
    if (this.textColor) {
      this.style.color = this.textColor
    }
    else {
      this.style.color = "currentColor"
    }
  }
  _updateColors(formElement) {
    if (formElement.name == "text-color") {
      this.setAttribute("text-color",formElement.value)
    }
    else if (formElement.name == "background-color") {
      this.setAttribute("background-color",formElement.value)
      this.render()
    }
  }
}
