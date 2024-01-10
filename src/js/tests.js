import {
  TestCaseComponent,
} from "./brutaldom/testing"

import "./components/ColorSwatchComponent.tests.js"
import "./components/ColorNameComponent.tests.js"
import "./components/PaletteColorScaleComponent.tests.js"


document.addEventListener("DOMContentLoaded", () => {
  TestCaseComponent.define()
})
