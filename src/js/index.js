import ElementSourceComponent     from "./brutaldom/components/ElementSourceComponent"
import ColorSwatchComponent       from "./components/ColorSwatchComponent"
import ColorNameComponent         from "./components/ColorNameComponent"
import PaletteColorScaleComponent from "./components/PaletteColorScaleComponent"

document.addEventListener("DOMContentLoaded", () => {
  ColorSwatchComponent.define()
  ColorNameComponent.define()
  PaletteColorScaleComponent.define()
  ElementSourceComponent.define()
})
