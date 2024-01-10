import ElementSourceComponent from "./brutaldom/components/ElementSourceComponent"
import ColorSwatchComponent   from "./components/ColorSwatchComponent"
import ColorNameComponent     from "./components/ColorNameComponent"
import PaletteColorComponent  from "./components/PaletteColorComponent"

document.addEventListener("DOMContentLoaded", () => {
  ColorSwatchComponent.define()
  ColorNameComponent.define()
  PaletteColorComponent.define()
  ElementSourceComponent.define()
})
