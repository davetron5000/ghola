import Color from "../dataTypes/Color"
import HTMLId from "../dataTypes/HTMLId"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import IsCreatable from "../brutaldom/IsCreatable"
import Input from "./Input"

class EditableColorSwatchComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      attributeName: "color",
      klass: Color,
    },
    "description": { },
    "editable": {
      klass: Boolean,
    },
    "compact": {
      klass: Boolean,
    },
  }

  static events = {
    hexCodeChanged: {},
  }

  constructor() {
    super()
    this.editable = true
  }

  afterAppendTemplate({locator}) {
    this.$element.addEventListener("submit", (event) =>  event.preventDefault() )

    this.$hexCode = locator.$e("g-hex-code")

    this.$input = Input.wrap(locator.$e("input[type=color]"))
    this.$input.onChange( (event) => this.$hexCode.updateColor(Color.fromString(event.detail)) )
    this.$input.onChange( (event) => this.dispatchHexCodeChanged(Color.fromString(event.detail)))

    this.$inputLabel = locator.$e("label")
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      childTagName: "form",
    })
  }

  update({hexCode, description, compact}) {
    this.setAttribute("hex-code",hexCode.toString())
    this.setAttribute("description",description)
    this.setAttribute("compact",compact)
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.color) {
      this.$input.setAttribute("value",this.color.toString())
      this.$hexCode.updateColor(this.color)
    }
    else {
      this.$input.removeAttribute("value")
      this.$hexCode.clearColor()
    }
    if (this.description) {
      const id = HTMLId.fromString(this.description, { prefix: "color-swatch" })
      this.$inputLabel.setAttribute("for",id.toString())
      this.$inputLabel.textContent = `Choose color for ${this.description}`
      this.$input.setAttribute("labelled-by",id.toString())
    }
    else {
      this.$input.removeAttribute("labelled-by")
      this.$inputLabel.removeAttribute("for")
      this.$inputLabel.textContent = ""
    }
    if (this.compact) {
      this.$hexCode.hide()
      this.$input.classList.remove("h-5")
      this.$input.classList.add("h-4")
      this.$element.classList.remove("ba","pa-1")
      this.$element.classList.add("bn","pa-0")
    }
    else {
      this.$hexCode.show()
      this.$input.classList.remove("h-4")
      this.$input.classList.add("h-5")
      this.$element.classList.add("ba","pa-1")
      this.$element.classList.remove("bn","pa-0")
    }
    if (this.editable) {
      this.$input.removeAttribute("disabled")
    }
    else {
      this.$input.setAttribute("disabled",true)
    }
  }

  static define() {
    customElements.define(this.tagName, EditableColorSwatchComponent);
  }
  static tagName = "g-editable-color-swatch"
}
HasTemplate.mixInto(EditableColorSwatchComponent)
HasAttributes.mixInto(EditableColorSwatchComponent)
HasEvents.mixInto(EditableColorSwatchComponent)
IsCreatable.mixInto(EditableColorSwatchComponent)
export default EditableColorSwatchComponent
