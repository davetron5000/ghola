import { Component, EventManager } from "brutaldom"

import LightDarkSelector from "./LightDarkSelector"

export default class ColorSwatch extends Component {
  wasCreated(navTemplate, color,isDarker) {
    EventManager.defineEvents(this,"selected")

    this.$nav    = this.$("nav")
    this.$swatch = this.$("color-swatch")

    const lightDarkSelector = new LightDarkSelector(navTemplate.newNode())
    lightDarkSelector.onSelected( (choice) => {
      this.selectedEventManager.fireEvent(color,choice)
    })

    this.$swatch.style.backgroundColor = color.hex()
    this.$nav.appendChild(lightDarkSelector.element)
  }
}
