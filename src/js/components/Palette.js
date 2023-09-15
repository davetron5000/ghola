import { Component } from "brutaljs"

import ColorScaleRow from "./ColorScaleRow"
import Swatch from "./Swatch"

import Color      from "../Color"
import ColorWheel from "../ColorWheel"
import ColorScale from "../ColorScale"

export default class Palette extends Component {
  constructor(element, viewConfig={}) {
    super(element)

    this.viewConfig = viewConfig

    this.rowTemplate    = this.template("row")
    this.swatchTemplate = this.template("swatch")

    this.numColors = 6
    this.numShades = 5
    this.baseColor = new Color("#ff00ff")
    this.secondaryColor = undefined
    this.scaleModel = "FixedLightness"
    this.colorWheel = "NuancedHueBased"
    if ( !("swatchSize" in this.viewConfig) )   { this.viewConfig.swatchSize = "large" }
    if ( !("showDetails" in this.viewConfig) )  { this.viewConfig.showDetails = true }
    if ( !("showContrast" in this.viewConfig) ) { this.viewConfig.showContrast = true }
  }

  set swatchSize(val) {
    this.swatches.forEach( (swatch) => swatch.size = val )
    this.viewConfig.swatchSize = val
  }

  showDetails() {
    this.swatches.forEach( (swatch) => swatch.showNameAndHex() )
    this.rows.forEach( (row) => row.topAlignName() )
    this.viewConfig.showDetails = true
  }
  hideDetails() {
    this.swatches.forEach( (swatch) => swatch.hideNameAndHex() )
    this.rows.forEach( (row) => row.centerName() )
    this.viewConfig.showDetails = false
  }
  showContrast() {
    this.swatches.forEach( (swatch) => swatch.showContrast() )
    this.viewConfig.showContrast = true
  }
  hideContrast() {
    this.swatches.forEach( (swatch) => swatch.hideContrast() )
    this.viewConfig.showContrast = false
  }

  rebuild({numColors,baseColor,secondaryColor,numShades,scaleModel,colorWheel}) {

    if (numColors)      { this.numColors = numColors }
    if (numShades)      { this.numShades = numShades }
    if (baseColor)      { this.baseColor = baseColor }
    if (secondaryColor) { this.secondaryColor = secondaryColor }
    if (scaleModel)     { this.scaleModel = scaleModel }
    if (colorWheel)     { this.colorWheel = colorWheel }

    const colorWheelClass = ColorWheel.wheel(this.colorWheel)
    const wheel = new colorWheelClass({
      numColors: this.numColors,
      baseColors: [
        this.baseColor,
        this.secondaryColor,
      ]
    })
    const colorScaleClass = ColorScale.scale(this.scaleModel)

    this.element.innerHTML = ""
    this.swatches = []
    this.rows = []
    const categories = {}
    wheel.eachColor( (color) => {
      const colorScale = new colorScaleClass(color,this.numShades, this.baseColor)

      const category = color.category()
      let baseCategoryName = this.numColors <= 6 ? category.six : category.twelve
      let categoryName = baseCategoryName
      let index = 2
      while (categories[categoryName]) {
        categoryName = baseCategoryName + "-" + index
        index += 1
      }
      categories[categoryName] = true
      const colorScaleRow = new ColorScaleRow(
        this.rowTemplate.newNode({
          fillSlots: {
            name: categoryName,
          }
        })
      )

      const swatches = colorScale.colors().map( (color) => {
        const colorsToCompare = colorScale.comparisonColors(color)
        return new Swatch(
          this.swatchTemplate.newNode(),
          color,
          colorsToCompare,
        )
      })
      this.swatches = this.swatches.concat(swatches)
      this.rows.push(colorScaleRow)

      colorScaleRow.addSwatches(swatches)
      if (this.viewConfig.showContrast) { this.showContrast() } else { this.hideContrast() }
      if (this.viewConfig.showDetails) { this.showDetails() } else { this.hideDetails() }
      this.swatchSize = this.viewConfig.swatchSize

      this.element.appendChild(colorScaleRow.element)
    })
  }
}

