import ElementSourceComponent from "./brutaldom/components/ElementSourceComponent"
import ColorSwatchComponent   from "./components/ColorSwatchComponent"
import ColorNameComponent     from "./components/ColorNameComponent"

document.addEventListener("DOMContentLoaded", () => {
  ColorSwatchComponent.define()
  ColorNameComponent.define()
  ElementSourceComponent.define()
})
