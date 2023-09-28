import { Animator, Component } from "brutaldom"

export default class Grid extends Component {
  wasCreated() {
    this.colorSwatches = []
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

  addColorSwatch(colorSwatch) {
    this.element.appendChild(colorSwatch.element)
    this.colorSwatches.push(colorSwatch)
  }

  clear() {
    this.element.innerHTML = ""
    this.colorSwatches = []
  }

  show() {
    super.show()
    this._setHeightBasedOnNumColors()
  }

  hide() {
    super.hide()
  }

  _setHeightBasedOnNumColors() {
    const numSwatches = this.colorSwatches.length
    let height

    // We want to use the three column layout UNLESS there is
    // an even number of watches that doesn't divide by 33
    if ( (numSwatches % 3 != 0) && (numSwatches % 2 == 0) ) {
      this.element.classList.remove("cols-3")
      this.element.classList.add("cols-2")
      const rows = this.colorSwatches.length / 2
      height = 100 / rows
    }
    else {
      this.element.classList.add("cols-3")
      this.element.classList.remove("cols-2")
      const rows = this.colorSwatches.length / 3
      height = 100 / rows
    }
    this.colorSwatches.forEach( (c) => c.element.style.height = `${height}vh` )
  }
}
