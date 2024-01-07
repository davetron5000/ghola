import Color from "../dataTypes/Color"
import ColorName from "../dataTypes/ColorName"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import MethodMeasurement from "../brutaldom/MethodMeasurement"
import HasEvents from "../brutaldom/HasEvents"
import ColorScale from "../dataTypes/ColorScale"

import EditableColorSwatchComponent from "./EditableColorSwatchComponent"

class ColorScaleComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      klass: Color,
      attributeName: "baseColor",
    },
    "compact": {
      klass: Boolean,
    },
    "editable": {
      klass: Boolean,
    }
  }
  static events = {
    baseColorChange: {}
  }

  constructor() {
    super()
    this.numSteps = 7 
  }

  set baseColor(color) {
    this.colorScale = new ColorScale({ numSteps: this.numSteps, baseColor: color})
    this.name = color.name
  }

  updateBaseColor(color) {
    this.setAttribute("hex-code", color)
    this.dispatchBaseColorChange(color)
  }

  makeNormalSize() { this.setAttribute("compact", false) }
  makeCompact()    { this.setAttribute("compact", true) }
  preventEditing() { this.setAttribute("editable", false) }

  render() {
    if (!this.$element) {
      return
    }
    const measurement = new MethodMeasurement(performance,this,"render")
    if (this.name && this.colorScale) {
      if (!this.$editableColorSwatches) {
        measurement.measureCode("_createSwatches", ()=> {
        this.$editableColorSwatches = this._createSwatches()
        })
      }
      this.$editableColorSwatches.forEach( ($editableColorSwatch, index) => {
        measurement.measureCode(`forEach ${index}`, () => {
          $editableColorSwatch.update({
            hexCode: this.colorScale.color(index),
            //description: `${this.name} level ${index}`,
            //compact: this.compact
          })
        })
      })
    }
    if (this.compact) {
      this.$element.classList.remove("gap-2")
    }
    else {
      this.$element.classList.add("gap-2")
    }
    measurement.done()
  }

  _createSwatches() {
    const middle = (this.colorScale.length - 1) / 2
    return this.colorScale.map( (hexCode,index) => {
      const $editableColorSwatch = EditableColorSwatchComponent.appendNewChild(
        this.$element,
        {
          editable: this.editable && index == middle,
        }
      )
      if (index == middle) {
        $editableColorSwatch.onHexCodeChanged( (event) => {
          this.updateBaseColor(event.detail)
        })
      }
      return $editableColorSwatch
    })
  }

  static tagName = "g-color-scale"
  static define() {
    customElements.define(this.tagName, ColorScaleComponent);
  }
}

HasTemplate.mixInto(ColorScaleComponent)
HasAttributes.mixInto(ColorScaleComponent)
HasEvents.mixInto(ColorScaleComponent)

export default ColorScaleComponent
