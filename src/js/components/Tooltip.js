import { Component } from "brutaljs"

class TooltipContent extends Component {
  set contentFromElement(element) {
    const text = element.dataset.tooltip
    const anchor = element.dataset.tooltipAnchor
    const html = anchor ? `${text} <a href="/about.html#${anchor}" class="blue-dark">Read more…</a>` : text
    this.element.innerHTML = html
  }
}

export default class Tooltip extends Component {
  constructor(element) {
    super(element)
    this.closeButton = this.$selector("a")
    this.content = new TooltipContent(this.$("content"))
    this.closeButton.addEventListener("click", (event) => {
      event.preventDefault()
      this.content.textContent = ""
      this.hide()
    })
  }

  attach(elementsWithTooltips) {
    elementsWithTooltips.forEach( (element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault()
        this.content.contentFromElement = element
        this._positionAndShow(event)
      })
    })
  }

  _positionAndShow(event) {
    this.element.style.top = event.y + "px"
    this.element.style.left = event.x + "px"
    this.element.style.position = "fixed"
    this.show()
    // SUPER HACK
    const rectBefore = this.element.getBoundingClientRect()
    this.element.style.position = "absolute"
    const rectAfter = this.element.getBoundingClientRect()
    if (rectBefore.y != rectAfter.y) {
      this.element.style.top = (rectBefore.y - rectAfter.y) + "px"
    }
  }
}
