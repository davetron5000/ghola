import { Animator, Component, EventManager, Link } from "brutaldom"

export default class Help extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"go")
    this.goButton = new Link(this.$("go"))
    this.goButton.onClick(this.goEventManager)
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
}
