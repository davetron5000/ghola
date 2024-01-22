import { GetColorName } from "hex-color-to-color-name"
import ColorCategory from "./ColorCategory"
import Color from "./Color"

export default class ColorName {
  constructor(color) {
    if (!(color instanceof Color)) {
      throw `wtf: ${typeof(color)}`
    }
    this.name     = new ColorCategory(color).toString()
    this.category = new ColorCategory(color)
  }
  toString() { return this.name }

}
