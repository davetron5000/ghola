import { GetColorName } from "hex-color-to-color-name"
import ColorCategory from "./ColorCategory"
import Color from "./Color"

export default class ColorName {
  constructor(color) {
    if (!(color instanceof Color)) {
      throw `wtf: ${typeof(color)}`
    }
    this.color = color
  }

  get category() {
    if (!this._category) {
    this._category = new ColorCategory(this.color)
    }
    return this._category
  }

  get name() {
    if (!this._name) {
      this._name = this._bringIntoAtLeastTheFriggin80sFFS(GetColorName(this.color.toString()))
    }
    return this._name
  }

  toString() { return this.name }

  _bringIntoAtLeastTheFriggin80sFFS(colorName) {
    if (colorName.toLowerCase() == "flesh") {
      return "peach"
    }
    return colorName
  }

}
