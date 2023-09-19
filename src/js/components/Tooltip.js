import { Component } from "brutaljs"
export default class Tooltip extends Component {
  constructor(element,elementsWithTooltips) {
    super(element)
    this.closeButton = this.$selector("a")
    this.content = this.$("content")
    this.closeButton.addEventListener("click", (event) => {
      event.preventDefault()
      this.content.textContent = ""
      this.hide()
    })
    elementsWithTooltips.forEach( (element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault()
        const content = element.dataset.tooltip
        const anchor = element.dataset.tooltipAnchor
        const html = anchor ? `${content} <a href="/about.html#${anchor}" class="blue-dark">Read more…</a>` : content
        this.content.innerHTML = html
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
      })
    })
  }
}
