import {
  TestCaseComponent,
} from "./brutaldom/testing"

import "./components/ColorSwatchComponent.tests.js"
import "./components/ColorNameComponent.tests.js"
import "./components/PaletteColorScaleComponent.tests.js"
import "./components/AddColorScaleButtonComponent.tests.js"
import "./components/PaletteComponent.tests.js"
import "./components/PreviewTextComponent.tests.js"


document.addEventListener("DOMContentLoaded", () => {
  TestCaseComponent.define()
})
