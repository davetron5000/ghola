import ColorScaleBase from "./ColorScaleBase"

export default class FixedLightness extends ColorScaleBase {
  constructor(color, numShades, baseColor) {
    super(color, numShades)
    this.shades = this._scale(baseColor,numShades).steps.map( (lightness) => {
      return this.color.withLightness(Math.max(1,Math.min(99,lightness)), { model: this._model(), outOfRange: [ 1,99] })
    })
  }
}
