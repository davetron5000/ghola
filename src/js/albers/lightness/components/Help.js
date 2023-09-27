import { Component, EventManager, Link } from "brutaldom"

export default class Help extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"go")
    this.goButton = new Link(this.$("go"))
    this.goButton.onClick(this.goEventManager)
  }

  hide() {
    super.hide()
    this.element.classList.remove("flex")
  }
  show() {
    super.show()
    this.element.classList.remove("db")
    this.element.classList.add("flex")
  }
}
