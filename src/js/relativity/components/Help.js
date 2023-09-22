import { Component, EventManager, Link } from "brutaldom"

export default class Help extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"go", "continue")
    this.goButton = new Link(this.$("go"))
    this.goButton.onClick(this.goEventManager)
    this.continueButton = new Link(this.$("continue"))
    this.continueButton.onClick(this.continueEventManager)
  }

  hideGoButton() { this.goButton.hide() }
  showContinueButton() { this.continueButton.show() }
}
