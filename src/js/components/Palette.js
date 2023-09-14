import { Component } from "brutaljs"

import ColorScaleRow from "./ColorScaleRow"
import Swatch from "./Swatch"

import Color      from "../Color"
import ColorWheel from "../ColorWheel"
import ColorScale from "../ColorScale"

export default class Palette extends Component {
  constructor(element) {
    super(element)

    this.rowTemplate    = this.template("row")
    this.swatchTemplate = this.template("swatch")

    this.numColors = 6
    this.numShades = 5
    this.baseColor = new Color("#ff00ff")
    this.secondaryColor = undefined
  }

  rebuild({numColors,baseColor,secondaryColor,numShades}) {

    if (numColors)      { this.numColors = numColors }
    if (numShades)      { this.numShades = numShades }
    if (baseColor)      { this.baseColor = baseColor }
    if (secondaryColor) { this.secondaryColor = secondaryColor }

    const colorWheel = new ColorWheel({
      numColors: this.numColors,
      baseColors: [
        this.baseColor,
        this.secondaryColor,
      ]
    })

    this.element.innerHTML = ""
    colorWheel.eachColor( (color) => {
      const colorScale = new ColorScale(color,this.numShades)

      const colorScaleRow = new ColorScaleRow(
        this.rowTemplate.newNode({
          fillSlots: {
            name: color.category(this.numColors <= 6)
          }
        })
      )

      const swatches = colorScale.colors().map( (color) => {
        return new Swatch(
          this.swatchTemplate.newNode(),
          color
        )
      })

      colorScaleRow.addSwatches(swatches)
      this.element.appendChild(colorScaleRow.element)
    })
  }
}

