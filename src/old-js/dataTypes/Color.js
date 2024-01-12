import chroma from "chroma-js"
import ColorName from "./ColorName"
import RichString from "../brutaldom/RichString"

export default class Color {
  static REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")

  static fromString(possiblyUndefinedString) {
    if (possiblyUndefinedString) {
      if (possiblyUndefinedString instanceof Color) {
        return possiblyUndefinedString
      }
      try {
        return new Color(possiblyUndefinedString)
      }
      catch (e) {
        console.warn("When parsing: %o (%s): %o",possiblyUndefinedString,typeof possiblyUndefinedString,e)
        return null
      }
    }
    else {
      return null
    }
  }

  static fromHSL(h,s,l) {
    return new Color(chroma.hsl(h,s,l).hex())
  }

  static random() {
    return new Color(chroma.random().hex())
  }

  constructor(hexCodeAsString) {
    if (!hexCodeAsString) {
      throw `Color must be given a hex code`
    }
    const [matches, _hash, hexCode] = hexCodeAsString.match(Color.REGEXP)
    if (!matches) {
      throw `'${hexCodeAsString}' is not a valid hex code`
    }
    this.hexCode           = `#${hexCode}`.toUpperCase()
    this.name              = new ColorName(this)
    this._userSuppliedName = null
  }

  set category(value) {
    throw `You may not change the category`
  }

  set userSuppliedName(value) {
    this._userSuppliedName = RichString.fromString(value)
  }

  get userSuppliedName() {
    return this._userSuppliedName
  }

  get category() {
    if (this._userSuppliedName) {
      return this._userSuppliedName
    }
    else {
      if (!this._category) {
        this._category = RichString.fromString(this.name.category.broad)
      }
      return this._category
    }
  }

  toString() { return this.hexCode }
  isEqual(otherColor) {
    if (otherColor instanceof Color) {
      return otherColor.toString() === this.toString()
    }
    else {
      return false
    }
  }

  hsl() { return chroma(this.hexCode).hsl() }
  hue() { return this.hsl()[0] }
}
