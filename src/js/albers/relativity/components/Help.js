import { Animator, Component, EventManager, Link } from "brutaldom"

export default class Help extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"go", "continue")
    this.goButton = new Link(this.$("go"))
    this.goButton.onClick(this.goEventManager)
    this.continueButton = new Link(this.$("continue"))
    this.continueButton.onClick(this.continueEventManager)
    if (this.hidden) {
      this.element.style.opacity = 0
    }
    this.animator = new Animator(this.element,{
      duration: 200,
      styles: {
        opacity: {
          from: 0,
          to: 1,
        }
      }
    })
  }

  hideGoButton() { this.goButton.hide() }
  showContinueButton() { this.continueButton.show() }
}
