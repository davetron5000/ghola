import Color from "../dataTypes/Color"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class HexCodeComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      klass: Color,
      attributeName: "color",
    }
  }

  afterAppendTemplate({locator}) {
    this.$codeSlot = locator.$e("slot[name='code']")
  }

  updateColor(color) { this.setAttribute("hex-code", color.toString()) }
  clearColor()       { this.removeAttribute("hex-code") }

  render() {
    if (!this.$element) {
      return
    }
    if (this.color) {
      this.$codeSlot.textContent = this.color.toString()
    }
    else {
      this.$codeSlot.textContent = ""
    }
  }

  hide()  { this.style.display = "none" }
  show()  { this.style.display = "block" }

  static tagName = "g-hex-code"
  static define() {
    customElements.define(this.tagName, HexCodeComponent);
  }
}
HasTemplate.mixInto(HexCodeComponent)
HasAttributes.mixInto(HexCodeComponent)
export default HexCodeComponent
