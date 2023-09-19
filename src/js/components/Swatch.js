import chroma from "chroma-js"
import { Component, TypeOf } from "brutaljs"

class Name extends Component {
  static logContext = "ghola"
  wasCreated(color) {
    this.element.textContent = color.name()
  }
}

class Hex extends Component {
  static logContext = "ghola"
  wasCreated(color) {
    this.element.textContent = color.hex()
  }
}

class ContrastComparison extends Component {
  static logContext = "ghola"
  wasCreated(color, contrast) {
    this.color = color
    this.contrast = contrast
    this.element.style.color = color.hex()
    if (contrast < 4.5) {
      this.element.style.textDecorationLine = "line-through"
      this.element.style.textDecorationThickness = "3px"
    }
    else {
      this.element.style.textDecorationLine = "none"
      this.element.style.textDecorationThickness = "0"
    }
  }

  expand() {
    this.element.classList.remove("mb-0")
    this.element.classList.add("mb-2")
  }
  shrink() {
    this.element.classList.remove("mb-2")
    this.element.classList.add("mb-0")
  }
}
class ColorSquare extends Component {
  static logContext = "ghola"
  wasCreated(color,comparisonColors) {
    this.methodStart("constructor")
    this.color = color
    this.element.style.backgroundColor = color.hex()
    this.comparisonTemplate = this.template("comparison")

    this.contrastComparisons = comparisonColors.map( (color) => {
      const contrast = Math.ceil(chroma.contrast(this.color.hex(),color.hex()) * 10) / 10
      const node = this.comparisonTemplate.newNode({
        fillSlots: {
          name: color.name(),
          contrast: contrast,
        }
      })
      this.element.appendChild(node)
      return new ContrastComparison(node,color,contrast)
    })
    this.methodDone("constructor")
  }

  set size(val) {
    if (val == "large") {
      this.element.classList.remove("h-5")
      this.element.classList.add("h-6")
      this.contrastComparisons.forEach( (contrastComparison) => {
        contrastComparison.expand()
      })
    }
    else if (val == "small") {
      this.element.classList.remove("h-6")
      this.element.classList.add("h-5")
      this.contrastComparisons.forEach( (contrastComparison) => {
        contrastComparison.shrink()
      })
    }
    else {
      throw `${val} is not a valid Swatch size`
    }
  }
  showContrast() {
    this.contrastComparisons.forEach( (contrastComparison) => {
      contrastComparison.show()
    })
  }
  hideContrast() {
    this.contrastComparisons.forEach( (contrastComparison) => {
      contrastComparison.hide()
    })
  }
}
export default class Swatch extends Component {
  static logContext = "ghola"
  wasCreated(color, comparisonColors) {
    this.methodStart("constructor")
    if (!color) {
      throw `color is required`
    }
    else if (TypeOf.asString(color) != "Color") {
      throw `color must be a Color, not a ${TypeOf.asString(color)}`
    }
    this.color = color

    this.colorSquare = new ColorSquare(this.$("color"),this.color, comparisonColors)
    this.name        = new Name(this.$("name"), this.color)
    this.hex         = new Hex(this.$("hex"), this.color)

    this.size = "large"
    this.methodDone("constructor")
  }

  set size(val) {
    this.colorSquare.size = val
  }

  showNameAndHex() {
    this.element.classList.add("mr-2","ba","bc-gray-light","pa-1")
    this.name.show()
    this.hex.show()
  }
  hideNameAndHex() {
    this.element.classList.remove("mr-2","ba","bc-gray-light","pa-1")
    this.name.hide()
    this.hex.hide()
  }
  showContrast() {
    this.colorSquare.showContrast()
  }
  hideContrast() {
    this.colorSquare.hideContrast()
  }
}
