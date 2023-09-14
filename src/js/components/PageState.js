import { EventManager } from "brutaljs"

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

  set colorHex(val) {
    this.params.colorHex = val
    this._save()
  }
  get colorHex() { return this.params.colorHex }

  set color(val) { this.colorHex = val.hex() }
  get color()    { return new Color(this.colorHex) }

  set numColors(val) {
    this.params.numColors = val
    this._save()
  }
  get numColors() { return this.params.numColors }

  set numShades(val) {
    this.params.numShades = val
    this._save()
  }
  get numShades() { return this.params.numShades }

  _save() {
    const searchParams = new URLSearchParams(this.params)
    this.window.history.pushState(this.params,"unused",this.window.location.pathname + "?" + searchParams.toString())
  }

}
