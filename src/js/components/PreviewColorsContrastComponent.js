import BaseCustomElement from "../brutaldom/BaseCustomElement"
import Color from "../Color"

export default class PreviewColorsContrastComponent extends BaseCustomElement {

  static tagName = "g-preview-colors-contrast"
  static observedAttributes = [
    "preview-color-selection",
    "show-warnings",
  ]

  previewColorSelectionChangedCallback({newValue}) {
    this.previewColorSelectionId = newValue
  }

  constructor() {
    super()
    this.colorSelectionColorsChangeListener = (event) => {
      const colorRadioText = event.target.querySelector("input[name='text-color']:checked")
      const colorRadioBackground = event.target.querySelector("input[name='background-color']:checked")
      if (colorRadioText && colorRadioBackground) {
        this.colorText = new Color(colorRadioText.value)
        this.colorBackground = new Color(colorRadioBackground.value)
        this.render()
      }
    }
  }

  render() {
    const previewColorSelection = document.getElementById(this.previewColorSelectionId)
    if (!previewColorSelection) {
      return
    }
    previewColorSelection.addEventListener("colors-change", this.colorSelectionColorsChangeListener)
    if (this.colorText && this.colorBackground) {
      const contrast = Math.floor(this.colorText.contrast(this.colorBackground) * 100) / 100
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
}
