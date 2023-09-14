import { Component } from "brutaljs"

export default class Swatch extends Component {
  constructor(element, color) {
    super(element)
    this.color = color

    this.colorSquare = this.$("color")
    this.name        = this.$("name")
    this.hex         = this.$("hex")
    this.hsl         = this.$("hsl")

    this.colorSquare.style.backgroundColor = this.color.hex()
    this.name.textContent = this.color.name()
    this.hex.textContent = this.color.hex()
    this.hsl.textContent = Math.round(this.color.hue())
  }
}
