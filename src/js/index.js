import AddColorScaleButtonComponent   from "./components/AddColorScaleButtonComponent"
import AttributeCheckboxComponent     from "./components/AttributeCheckboxComponent"
import ColorNameComponent             from "./components/ColorNameComponent"
import ColorSwatchComponent           from "./components/ColorSwatchComponent"
import DownloadPaletteComponent       from "./components/DownloadPaletteComponent"
import ElementSourceComponent         from "./brutaldom/components/ElementSourceComponent"
import PaletteColorScaleComponent     from "./components/PaletteColorScaleComponent"
import PaletteComponent               from "./components/PaletteComponent"
import PreviewColorsContrastComponent from "./components/PreviewColorsContrastComponent"
import PreviewColorSelectionComponent from "./components/PreviewColorSelectionComponent"
import PreviewComponent               from "./components/PreviewComponent"
import PreviewTextComponent           from "./components/PreviewTextComponent"

import PaletteUI from "./PaletteUI"
import SaveableState from "./SaveableState"

document.addEventListener("DOMContentLoaded", () => {
  AddColorScaleButtonComponent.define()
  AttributeCheckboxComponent.define()
  ColorNameComponent.define()
  ColorSwatchComponent.define()
  DownloadPaletteComponent.define()
  ElementSourceComponent.define()
  PaletteColorScaleComponent.define()
  PaletteComponent.define()
  PreviewComponent.define()
  PreviewColorsContrastComponent.define()
  PreviewTextComponent.define()
  PreviewColorSelectionComponent.define()

  const saveableState = new SaveableState()

  const paletteComponent = document.querySelector("g-palette")
  if (paletteComponent) {
    const paletteUI = new PaletteUI(saveableState)
    paletteUI.build()

    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.url) {
        window.location = event.state.url
      }
    })
  }
})
