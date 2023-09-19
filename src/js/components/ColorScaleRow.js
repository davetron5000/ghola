import { Component } from "brutaldom"

export default class ColorScaleRow extends Component {
  wasCreated() {
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
