import BaseCustomElement from "../brutaldom/BaseCustomElement"
import PreviewColorSelectionComponent from "./PreviewColorSelectionComponent"

export default class PreviewComponent extends BaseCustomElement {

  static tagName = "g-preview"
  static observedAttributes = [
    "show-warnings",
  ]

  constructor() {
    super()
    this.colorScale = []
  }

  set colorScale(scale) {
    this._colorScale = scale
    this.render()
  }

  get colorScale() {
    return this._colorScale || []
  }

  render() {
    this.querySelectorAll(PreviewColorSelectionComponent.tagName).forEach( (element) => {
      element.setAttribute("color-scale",this.colorScale.join(","))
    })
    this.querySelectorAll("g-preview-text").forEach( (element) => {
      element.setAttribute("background-color", this.colorScale[this.colorScale.length - 1])
      element.setAttribute("text-color", this.colorScale[0])
    })
  }
}
