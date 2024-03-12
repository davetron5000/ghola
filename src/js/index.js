import AddColorScaleButtonComponent   from "./components/AddColorScaleButtonComponent"
import AttributeCheckboxComponent     from "./components/AttributeCheckboxComponent"
import ColorNameComponent             from "./components/ColorNameComponent"
import ColorSwatchComponent           from "./components/ColorSwatchComponent"
import CopyCodeComponent              from "./components/CopyCodeComponent"
import DownloadPaletteComponent       from "./components/DownloadPaletteComponent"
import ElementSourceComponent         from "./brutaldom/components/ElementSourceComponent"
import PaletteColorScaleComponent     from "./components/PaletteColorScaleComponent"
import PaletteComponent               from "./components/PaletteComponent"
import PreviewColorsContrastComponent from "./components/PreviewColorsContrastComponent"
import PreviewColorSelectionComponent from "./components/PreviewColorSelectionComponent"
import PreviewComponent               from "./components/PreviewComponent"
import PreviewTextComponent           from "./components/PreviewTextComponent"
import PreviewControlsComponent       from "./components/PreviewControlsComponent"
import BoxShadowComponent             from "./components/BoxShadowComponent"
import BoxShadowFormComponent         from "./components/BoxShadowFormComponent"
import BoxShadowScaleComponent        from "./components/BoxShadowScaleComponent"
import XYInputComponent               from "./components/XYInputComponent"

import PaletteUI from "./PaletteUI"

document.addEventListener("DOMContentLoaded", () => {
  AddColorScaleButtonComponent.define()
  AttributeCheckboxComponent.define()
  BoxShadowComponent.define()
  BoxShadowFormComponent.define()
  BoxShadowScaleComponent.define()
  ColorNameComponent.define()
  ColorSwatchComponent.define()
  CopyCodeComponent.define()
  DownloadPaletteComponent.define()
  ElementSourceComponent.define()
  PaletteColorScaleComponent.define()
  PaletteComponent.define()
  PreviewComponent.define()
  PreviewColorsContrastComponent.define()
  PreviewTextComponent.define()
  PreviewControlsComponent.define()
  PreviewColorSelectionComponent.define()
  XYInputComponent.define()

  const paletteComponent = document.querySelector(PaletteComponent.tagName)
  if (paletteComponent) {
    const saveableState = paletteComponent.saveableState
    saveableState.start()
    const paletteUI = new PaletteUI(saveableState)
    paletteUI.build()

    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.url) {
        window.location = event.state.url
      }
    })
  }
})
