import ElementSourceComponent from "./brutaldom/components/ElementSourceComponent"
import ColorSwatchComponent from "./components/ColorSwatchComponent"

document.addEventListener("DOMContentLoaded", () => {
  ColorSwatchComponent.define()
  ElementSourceComponent.define()
})
