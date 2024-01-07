import {
  TestCaseComponent,
} from "./brutaldom/testing"

import "./ColorSwatchComponent.tests.js"
import "./ColorNameComponent.tests.js"


document.addEventListener("DOMContentLoaded", () => {
  TestCaseComponent.define()
})
