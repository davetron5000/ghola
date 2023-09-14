import { Component } from "brutaljs"

export default class ColorScaleRow extends Component {
  constructor(element) {
    super(element)
    this.shadesSlot = this.$slot("shades")
  }

  addSwatches(swatches) {
    swatches.forEach( (swatch) => {
      this.shadesSlot.appendChild(swatch.element)
    })
  }
}
