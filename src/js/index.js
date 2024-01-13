import AddColorScaleButtonComponent from "./components/AddColorScaleButtonComponent"
import AttributeCheckboxComponent   from "./components/AttributeCheckboxComponent"
import ColorNameComponent           from "./components/ColorNameComponent"
import ColorSwatchComponent         from "./components/ColorSwatchComponent"
import DownloadPaletteComponent     from "./components/DownloadPaletteComponent"
import ElementSourceComponent       from "./brutaldom/components/ElementSourceComponent"
import PaletteColorScaleComponent   from "./components/PaletteColorScaleComponent"

document.addEventListener("DOMContentLoaded", () => {
  AddColorScaleButtonComponent.define()
  AttributeCheckboxComponent.define()
  ColorNameComponent.define()
  ColorSwatchComponent.define()
  DownloadPaletteComponent.define()
  ElementSourceComponent.define()
  PaletteColorScaleComponent.define()
})
