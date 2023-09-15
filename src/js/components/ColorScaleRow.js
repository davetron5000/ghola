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

  centerName() {
    this.element.classList.remove("items-start")
    this.element.classList.add("items-center")
  }

  topAlignName() {
    this.element.classList.add("items-start")
    this.element.classList.remove("items-center")
  }
}
