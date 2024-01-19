import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class PreviewColorSelectionComponent extends BaseCustomElement {

  static tagName = "g-preview-color-selection"
  static observedAttributes = [
    "preview-text",
    "color-scale",
    "show-warnings",
  ]

  constructor() {
    super()
    this.colorSelectedEventListener = (event) => {
      const previewText = document.getElementById(this.previewTextId)
      if (previewText) {
        if (event.target.checked) {
          previewText.setAttribute(event.target.name,event.target.value)
        }
      }
      this.dispatchEvent(new CustomEvent("colors-change"))
    }
  }

  previewTextChangedCallback({newValue,oldValue}) {
    this.previewTextId = newValue
    if (newValue != oldValue) {
      this.dispatchEvent(new CustomEvent("colors-change"))
    }
  }

  colorScaleChangedCallback({newValue}) {
    let scale = (newValue || "").split(/,/)
    if (scale == [""]) {
      scale = []
    }
    this.colorScale = scale
  }

  render() {
    this.querySelectorAll("input[type=radio]").forEach( (element) => {
      element.addEventListener("change",this.colorSelectedEventListener)
    })
    if (!this.colorScale) {
      return
    }
    this.querySelectorAll("[data-background] g-color-swatch").forEach( (element, index, array) => {
      if ( (index == 0) || (index == (array.length - 1) ) ) {
        return
      }
      const colorScaleIndex = index - 1
      if (this.colorScale[colorScaleIndex]) {
        element.setAttribute("hex-code",this.colorScale[colorScaleIndex])
      }
    })
    this.querySelectorAll("[data-text] g-color-swatch").forEach( (element, index, array) => {
      if ( (index == 0) || (index == (array.length - 1) ) ) {
        return
      }
      const colorScaleIndex = index - 1
      if (this.colorScale[colorScaleIndex]) {
        element.setAttribute("hex-code",this.colorScale[colorScaleIndex])
      }
    })
    if (this.querySelectorAll("input[type=radio][name='text-color']:checked").length == 0) {
      const selector = `input[type=radio][name='text-color'][value='${this.colorScale[0]}']`
      const defaultTextColor = this.querySelector(selector)
      if (defaultTextColor) {
        defaultTextColor.checked = true
        this.dispatchEvent(new CustomEvent("colors-change"))
      }
    }
    if (this.querySelectorAll("input[type=radio][name='background-color']:checked").length == 0) {
      const selector = `input[type=radio][name='background-color'][value='${this.colorScale[this.colorScale.length - 1]}']`
      const defaultTextColor = this.querySelector(selector)
      if (defaultTextColor) {
        defaultTextColor.checked = true
        this.dispatchEvent(new CustomEvent("colors-change"))
      }
    }
  }
}
