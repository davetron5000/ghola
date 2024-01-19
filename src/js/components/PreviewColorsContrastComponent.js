import BaseCustomElement from "../brutaldom/BaseCustomElement"
import Color from "../Color"

export default class PreviewColorsContrastComponent extends BaseCustomElement {

  static tagName = "g-preview-colors-contrast"
  static observedAttributes = [
    "show-warnings",
    "background-color",
    "text-color",
    "form",
  ]

  formChangedCallback({newValue}) {
    this.formName = newValue
  }

  backgroundColorChangedCallback({newValue}) {
    this.backgroundColor = newValue ? new Color(newValue) : null
  }

  textColorChangedCallback({newValue}) {
    this.textColor = newValue ? new Color(newValue) : null
  }

  constructor() {
    super()
    this.formElementChangeListener = (event) => {
      this._updateColors(event.target)
    }
  }

  get form() {
    if (!this.formName) {
      return null
    }
    return document.querySelector(`form[name='${this.formName}']`)
  }

  render() {
    if (!this.form) {
      return
    }
    Array.from(this.form.elements).forEach( (element) => {
      element.addEventListener("change",this.formElementChangeListener)
    })
    if (this.textColor && this.backgroundColor) {
      const contrast = Math.floor(this.textColor.contrast(this.backgroundColor) * 100) / 100
      this.querySelectorAll("[data-ratio]").forEach( (element) => {
        element.textContent = contrast
      })
      this.querySelectorAll("[data-enhanced]").forEach( (element) => {
        if ( contrast >= 7.1 ) {
          element.style.display = "inline"
        }
        else {
          element.style.display = "none"
        }
      })
      this.querySelectorAll("[data-minimum]").forEach( (element) => {
        if ( (contrast >= 4.5) && (contrast < 7.1) ) {
          element.style.display = "inline"
        }
        else {
          element.style.display = "none"
        }
      })
      this.querySelectorAll("[data-insufficient]").forEach( (element) => {
        if ( contrast < 4.5 ) {
          element.style.display = "inline"
        }
        else {
          element.style.display = "none"
        }
      })
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
