import { Component } from "brutaldom"
import Swatch from "../../../components/Swatch"

export default class ResultsPanel extends Component {
  wasCreated(swatchTemplate) {
    this.swatchTemplate = swatchTemplate
    this.$swatches = this.$("swatches")
  }

  set colors (val) {
    this.$swatches.innerHTML = ""
    if (val.length == 0) {
      this.$swatches.innerHTML = "<h4 class='tc'>None - weird</h4>"
    }
    else {
      val.forEach( (color) => {
        const node = this.swatchTemplate.newNode()
        const swatch = new Swatch(
          node,
          color,
          []
        )
        this.$swatches.appendChild(node)
      })
    }
  }
}
