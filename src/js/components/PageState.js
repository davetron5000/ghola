import { EventManager } from "brutaldom"

import Color from "../Color"

export default class PageState {
  constructor(window,defaults) {
    this.window = window
    const searchParams = new URL(this.window.location).searchParams

    this.params = defaults
    for (const [ key, value ] of searchParams) {
      this.params[key] = value
    }

    EventManager.defineEvents(this,"popstate")
    this.window.addEventListener("popstate", (event) => {
      this.params = event.state
      this.popstateEventManager.fireEvent({ color: this.color, ...this.params })
    })
  }

  // Derived attributes
  set color(val)           { this.colorHex = val.hex() }
  get color()              { return new Color(this.colorHex) }
  get isShowColorDetails() { return this.showColorDetails == "true" }
  get isShowContrastInfo() { return this.showContrastInfo == "true" }
  get isBigSwatches()      { return this.bigSwatches == "true" }
  get isSecondaryColorChecked() { return this.params.secondaryColorChecked == "true" }
  set secondaryColor(val)  {
    if (val) {
      this.params.secondaryColorChecked = "true"
      this.secondaryColorHex = val.hex()
    }
    else {
      this.params.secondaryColorChecked = "false"
      this._save()
    }
  }
  get secondaryColor() {
    if (this.secondaryColorHex) {
      return new Color(this.secondaryColorHex)
    }
    else {
      return null
    }
  }

  // Attributes serialized to the query string
  set colorHex(val)          { this.params.colorHex = val; this._save() }
  get colorHex()             { return this.params.colorHex }
  set secondaryColorHex(val) { this.params.secondaryColorHex = val; this._save() }
  get secondaryColorHex()    { return this.params.secondaryColorHex }
  set numColors(val)         { this.params.numColors = val; this._save() }
  get numColors()            { return this.params.numColors }
  set numShades(val)         { this.params.numShades = val; this._save() }
  get numShades()            { return this.params.numShades }
  set scaleModel(val)        { this.params.scaleModel = val; this._save() }
  get scaleModel()           { return this.params.scaleModel }
  set colorWheel(val)        { this.params.colorWheel = val; this._save() }
  get colorWheel()           { return this.params.colorWheel }

  set showColorDetails(val) { this.params.showColorDetails = val; this._save() }
  get showColorDetails()    { return this.params.showColorDetails }
  set showContrastInfo(val) { this.params.showContrastInfo = val; this._save() }
  get showContrastInfo()    { return this.params.showContrastInfo }
  set bigSwatches(val)      { this.params.bigSwatches = val; this._save() }
  get bigSwatches()         { return this.params.bigSwatches }

  _save() {
    const searchParams = new URLSearchParams(this.params)
    if (!this.params.secondaryColorHex)  {
      searchParams.delete("secondaryColorHex")
    }
    this.window.history.pushState(this.params,"unused",this.window.location.pathname + "?" + searchParams.toString())
  }

}
