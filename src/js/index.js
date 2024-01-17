import AddColorScaleButtonComponent from "./components/AddColorScaleButtonComponent"
import AttributeCheckboxComponent   from "./components/AttributeCheckboxComponent"
import ColorNameComponent           from "./components/ColorNameComponent"
import ColorSwatchComponent         from "./components/ColorSwatchComponent"
import DownloadPaletteComponent     from "./components/DownloadPaletteComponent"
import ElementSourceComponent       from "./brutaldom/components/ElementSourceComponent"
import PaletteColorScaleComponent   from "./components/PaletteColorScaleComponent"
import PaletteComponent             from "./components/PaletteComponent"

import PaletteUI from "./PaletteUI"
import PushState from "./PushState"


document.addEventListener("DOMContentLoaded", () => {
  AddColorScaleButtonComponent.define()
  AttributeCheckboxComponent.define()
  ColorNameComponent.define()
  ColorSwatchComponent.define()
  DownloadPaletteComponent.define()
  ElementSourceComponent.define()
  PaletteColorScaleComponent.define()
  PaletteComponent.define()

  const pushState = new PushState()

  const paletteComponent = document.querySelector("g-palette")
  if (paletteComponent) {
    const paletteUI = new PaletteUI(pushState)
    paletteUI.build()

    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.url) {
        window.location = event.state.url
      }
    })
  }
})
