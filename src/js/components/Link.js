import { Component, EventManager } from "brutaljs"

export default class Link extends Component {
  constructor(element) {
    super(element)
    this.clickEventManager = EventManager.createDirectProxyFor(this, { element: this.element, eventName: "click" })
  }
}
