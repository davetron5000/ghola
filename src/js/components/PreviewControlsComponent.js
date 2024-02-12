import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class PreviewControlsComponent extends BaseCustomElement {

  static tagName = "g-preview-controls"
  static observedAttributes = [
    "background-color",
    "text-color",
    "color-scale",
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
    this.colorScale = []
  }

  backgroundColorChangedCallback({newValue}) {
    this.backgroundColor = newValue
  }

  textColorChangedCallback({newValue}) {
    this.textColor = newValue
  }
  colorScaleChangedCallback({newValue}) {
    if (newValue) {
      this.colorScale = newValue.split(/,/)
    }
    else {
      this.colorScale = []
    }
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
    this.querySelectorAll("div[data-container]").forEach( (element) => element.parentElement.removeChild(element) )
    const fieldset = this.querySelector("fieldset")
    if (!fieldset) {
      this.logger.warn("no <fieldset> found, so cannot do any previewing")
      return
    }
    this.colorScale.forEach( (hexCode) => {
      const container = document.createElement("div")
      container.classList.add("flex","gap-2","pa-2")
      container.dataset["container"] = true
      const newFieldSetContrast = fieldset.cloneNode(true)
      newFieldSetContrast.style.display = "flex"

      if (this.backgroundColor) {
        newFieldSetContrast.style.backgroundColor = this.backgroundColor
      }
      else {
        newFieldSetContrast.style.backgroundColor = "transparent"
      }

      newFieldSetContrast.querySelectorAll("button").forEach( (button) => {
        button.style.color = this.colorScale[0]
        button.style.backgroundColor = this.colorScale[this.colorScale.length - 1]
        button.style.borderColor = hexCode
      })
      newFieldSetContrast.querySelectorAll("input").forEach( (input) => {
        input.style.color = this.colorScale[0]
        input.style.backgroundColor = this.colorScale[this.colorScale.length - 1]
        input.style.borderColor = hexCode
      })

      const newFieldSetSelection = fieldset.cloneNode(true)
      newFieldSetSelection.style.display = "flex"
      newFieldSetSelection.dataset["added"] = true

      if (this.backgroundColor) {
        newFieldSetSelection.style.backgroundColor = this.colorScale[this.colorScale.length - 1]
      }
      else {
        newFieldSetSelection.style.backgroundColor = "transparent"
      }

      newFieldSetSelection.querySelectorAll("button").forEach( (button) => {
        button.style.color = this.textColor
        button.style.backgroundColor = this.backgroundColor
        button.style.borderColor = hexCode
        button.textContent = hexCode
      })
      newFieldSetSelection.querySelectorAll("input").forEach( (input) => {
        input.style.color = this.textColor
        input.style.backgroundColor = this.backgroundColor
        input.style.borderColor = hexCode
      })
      container.appendChild(newFieldSetContrast)
      container.appendChild(newFieldSetSelection)
      fieldset.parentElement.appendChild(container)
    })
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
