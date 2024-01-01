import Color from "./dataTypes/Color"
import DerivedColor from "./dataTypes/DerivedColor"
import ColorWheel from "./dataTypes/ColorWheel"
import RichString from "./brutaldom/RichString"
import MethodMeasurement from "./brutaldom/MethodMeasurement"

class HexCodeAndName {

  static NULL_VALUE = {
    asColor: () => null,
    asColorOrAlgorithm: () => null,
  }

  static fromString(string) {
    if (string) {
      const [hexCode,...nameParts] = string.split(/:/)
      const name = nameParts.length > 0 ? nameParts.join(":") : null
      return new HexCodeAndName(hexCode,name)
    }
    else {
      return HexCodeAndName.NULL_VALUE
    }
  }

  constructor(hexCode,name) {
    this.hexCode = hexCode
    this.name = name
  }


  asColor() {
    const color = Color.fromString(this.hexCode)
    if (color && this.name) {
      color.userSuppliedName = RichString.fromString(this.name)
    }
    return color
  }

  asColorOrAlgorithm() {
    try {
      return new DerivedColor({
        algorithm: ColorWheel.algorithm(this.hexCode).toString(),
        userSuppliedName: this.name ? RichString.fromString(this.name) : null,
      })
    }
    catch (e) {
      const color = this.asColor()
      if (!color) {
        console.warn("'%s' is not a hexcode, nor algorithm: %o",this.hexcode,e)
        return null
      }
      return color
    }
  }
}

class PaletteState {

  static fromState(state) {
    let primaryColor

    if (state.primaryColor) {
      primaryColor = Color.fromString(state.primaryColor.hexCode)
      if (primaryColor) {
        primaryColor.userSuppliedName = state.primaryColor.userSuppliedName
      }
    }

    const otherColors = (state.otherColors || []).map( (otherColorFromState) => {
      if (otherColorFromState) {
        if (otherColorFromState.hexCode) {
          const otherColor = Color.fromString(otherColorFromState.hexCode)
          otherColor.userSuppliedName = otherColorFromState.userSuppliedName
          return otherColor
        }
        else {
          return new DerivedColor({
            algorithm: otherColorFromState.algorithm,
            userSuppliedName: otherColorFromState.userSuppliedName
          })
        }
      }
      else {
        return null
      }

    })
    return new PaletteState(
      primaryColor,
      otherColors
    )
  }

  constructor(primaryColor,otherColors) {
    this.primaryColor = primaryColor
    this.otherColors = otherColors

  }

  asState() {
    const state = {}

    if (this.primaryColor) {
      state.primaryColor = {
        hexCode: this.primaryColor.hexCode,
      }
      if (this.primaryColor.userSuppliedName) {
        state.primaryColor.userSuppliedName = this.primaryColor.userSuppliedName.toString()
      }
    }

    state.otherColors = this.otherColors.map( (color) => {
      if (color) {
        const colorState = {}
        if (color instanceof Color) {
          colorState.hexCode = color.hexCode
        }
        else {
          colorState.algorithm = color.algorithm
        }
        if (color.userSuppliedName) {
          colorState.userSuppliedName = color.userSuppliedName.toString()
        }
        return colorState
      }
      else {
        return {}
      }
    })
    return state
  }

  asSearchParams() {
    const searchParams = []

    if (this.primaryColor) {
      searchParams.push( [
        "primaryColor",
        this._colorToParam(this.primaryColor)
      ])
    }
    searchParams.push([
      "otherColors",
      this.otherColors.map( (color) => this._colorToParam(color) ).join(",")
    ])
    return searchParams
  }

  _colorToParam(color) {
    if (color) {
      const string = color instanceof Color ? color.hexCode : color.algorithm.toString()
      if (color.userSuppliedName) {
        return `${string}:${color.userSuppliedName}`
      }
      else {
        return string
      }

    }
    else {
      return ""
    }
  }

}

export default class PaletteSerializer {

  constructor(palette, window) {
    this.palette = palette
    this.window = window

    this.window.addEventListener("popstate", (event) => {
      console.log("POPSTATE…ALL RIGHT! %o",event)
      if (event.state) {
        this.replace(PaletteState.fromState(event.state))
      }
      else {
        this.clear()
      }
    })
  }

  save() {
    const state = new PaletteState(this.palette.primaryColor,this.palette.otherColors)

    const url = new URL(this.window.location);
    const urlNow = url.toString()

    state.asSearchParams().forEach( ([key,value]) => url.searchParams.set(key, value) )
    if (urlNow != url.toString()) {
      history.pushState(
        state.asState(),
        "",
        url.toString()
      )
    }
  }

  load() {
    const url = new URL(this.window.location);
    const primaryColor = HexCodeAndName.fromString(url.searchParams.get("primaryColor")).asColor()
    const otherColors = (url.searchParams.get("otherColors") || "").split(",").
      map( (string) => HexCodeAndName.fromString(string).asColorOrAlgorithm() ).
      filter( (possiblyNullColor) => possiblyNullColor )

    this.palette.replace(
      primaryColor,
      otherColors
    )
  }

  replace(paletteState) {
    this.palette.replace(
      paletteState.primaryColor,
      paletteState.otherColors
    )
  }

  clear() {
    this.window.location.reload()
  }
}
