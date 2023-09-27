import { Component, EventManager } from "brutaldom"

import LightDarkButton from "./LightDarkButton"
import LightnessType   from "../LightnessType"

export default class LightDarkSelector extends Component {
  wasCreated() {

    EventManager.defineEvents(this,"selected")

    this.cssWhenSelected    = this.element.dataset.selected.split(/\s/)
    this.cssWhenNotSelected = this.element.dataset.notSelected.split(/\s/)
    this.cssUnknown         = this.element.dataset.unknown.split(/\s/)

    this.light = new LightDarkButton(this.$("light"), this.cssWhenSelected, this.cssWhenNotSelected, this.cssUnknown)
    this.dark  = new LightDarkButton(this.$("dark"), this.cssWhenSelected, this.cssWhenNotSelected, this.cssUnknown)

    this.choice = undefined

    this.light.onClick( () => {
      this.choice= LightnessType.light()
      this.dark.deselect()
      this.selectedEventManager.fireEvent(this.choice)
    })

    this.dark.onClick( () => {
      this.choice = LightnessType.dark(),
      this.light.deselect()
      this.selectedEventManager.fireEvent(this.choice)
    })
  }
}
