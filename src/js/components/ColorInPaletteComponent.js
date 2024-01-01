import Color                   from "../dataTypes/Color"
import ColorWheel              from "../dataTypes/ColorWheel"
import ColorName               from "../dataTypes/ColorName"
import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import HasEvents               from "../brutaldom/HasEvents"
import IsCreatable             from "../brutaldom/IsCreatable"
import Button                  from "./Button"
import Hideable                from "./Hideable"
import RichString              from "../brutaldom/RichString"

class ColorInPaletteComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      klass: Color,
      attributeName: "color",
    },
    "primary": {
      klass: Boolean,
    },
    "compact": {
      klass: Boolean,
    },
    "user-color-name": {
      klass: RichString,
    },
    "color-deriviation-id": {},
    "color-derived-from-id": {},
    "color-derived-by-algorithm": {},
  }

  static events = {
    removed: {},
    baseColorChanged: {},
    derivedColorsAdded: {},
    nameChanged: {},
  }

  static selectorForColor(color) {
    return `${this.tagName}[hex-code='${color.hexCode}']`
  }


  afterAppendTemplate({locator}) {
    this.$colorScale = locator.$e("g-color-scale")
    this.$colorScale.onBaseColorChange( (event) => {
      if (this.colorDerivedFromId) {
      }
      else {
        this.dispatchBaseColorChanged(event.detail)
        this.setAttribute("hex-code",event.detail) 
      }
    })

    this.$analogousButton = Button.wrap(locator.$e("button[data-analogous]"))
    this.$analogousButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.analogous()) )

    this.$complementButton = Button.wrap(locator.$e("button[data-complement]"))
    this.$complementButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.complement()) )

    this.$splitComplementButton = Button.wrap(locator.$e("button[data-split-complement]"))
    this.$splitComplementButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.splitComplement()) )

    this.$triadButton = Button.wrap(locator.$e("button[data-triad]"))
    this.$triadButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.triad()) )

    this.$removeButton = Button.wrap(locator.$e("button[data-remove]"))
    this.$removeButton.onClick( () => this.dispatchRemoved(event.detail) )

    this.$nameInput = locator.$e("g-color-name-input")
    this.$nameInput.onEdited( (event) => this.setAttribute("user-color-name",event.detail) )
    this.$nameInput.onEdited( (event) => this.dispatchNameChanged(event.detail) )
    this.$nameInput.onCleared( (event) => this.removeAttribute("user-color-name") )
    this.$nameInput.onCleared( (event) => this.dispatchNameChanged(null) )

    this.$linkMessage = locator.$e("[data-link-message]")
    Hideable.addTo(this.$linkMessage)
    this.$linkMessageAlgorithm = locator.$e("[data-link-message-algorithm]")
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.$removeButton.disconnectedCallback()
  }

  get colorName() {
    return this.userColorName || this.color.category
  }

  get shades() {
    if (this.$colorScale) {
      return this.$colorScale.colorScale
    }
    else {
      return []
    }
  }

  updateColor(color) {
    this.setAttribute("hex-code",color)
    if (color.userSuppliedName) {
      this.setAttribute("user-color-name",color.userSuppliedName)
    }
    else {
      this.removeAttribute("user-color-name")
    }
  }

  makeCompact()    { this.setAttribute("compact",true) }
  makeNormalSize() { this.setAttribute("compact",false) }

  selectorForDerived(algorithm) {
    let id = this.getAttribute("color-derivation-id")
    if (!id) {
      id = 'has not been derived'
    }
    return `${this.tagName}[color-derived-from-id='${id}'][color-derived-by-algorithm='${algorithm.toString()}']`
  }

  deriveColorFrom(colorDerivationId,algorithm,userSuppliedName) {
    this.setAttribute("color-derived-from-id",colorDerivationId)
    this.setAttribute("color-derived-by-algorithm",algorithm)
    if (userSuppliedName) {
      this.setAttribute("user-color-name",userSuppliedName)
    }
    else {
      this.removeAttribute("user-color-name")
    }
  }

  ensureColorDerivationId() {
    let id = this.getAttribute("color-derivation-id")
    if (!id || id === "") {
      if (crypto) {
        id = crypto.randomUUID()
        this.setAttribute("color-derivation-id",id)
      }
      else {
        console.warn("'crypto' is not avaiable for some reason")
        id = "id-" + (Math.random() * Math.random() * Math.random()).toString()
      }
    }
    return id
  }

  render() {
    if (!this.$element) {
      return
    }

    if (this.color) {
      this.$colorScale.updateBaseColor(this.color)
    }

    if (this.userColorName) {
      this.$nameInput.setEditedValue(this.userColorName)
    }
    else {
      if (this.color) {
        this.$nameInput.setDerivedValue(this.color.category.humanize())
      }
      else {
        this.$nameInput.setDerivedValue("")
      }
    }

    if (this.primary) {
      this.$removeButton.hide()
      this.$complementButton.show()
      this.$splitComplementButton.show()
      this.$analogousButton.show()
      this.$triadButton.show()
    }
    else {
      this.$removeButton.show()
      this.$complementButton.hide()
      this.$splitComplementButton.hide()
      this.$analogousButton.hide()
      this.$triadButton.hide()
    }

    if (this.compact) {
      this.$colorScale.makeCompact()
      this.$nameInput.makeCompact()
    }
    else {
      this.$colorScale.makeNormalSize()
      this.$nameInput.makeNormalSize()
    }

    if (this.colorDerivedFromId && this.colorDerivedByAlgorithm) {
      const otherComponentInPalette = document.querySelector(`[color-derivation-id='${this.colorDerivedFromId}']`)
      this.$linkMessage.show()
      this.$linkMessageAlgorithm.textContent = RichString.fromString(this.colorDerivedByAlgorithm).humanize()
      if (otherComponentInPalette) {
        const updateColorFromDerived = () => {
          const algorithm = ColorWheel.algorithm(this.colorDerivedByAlgorithm)
          const otherColor = otherComponentInPalette.color
          this.setAttribute("hex-code",algorithm.deriveFrom(otherColor))
        }
        otherComponentInPalette.onBaseColorChanged( (event) => updateColorFromDerived() )
        this.$colorScale.preventEditing()
        updateColorFromDerived()
      }
      else {
        console.warn("%o has a color-derived-from-id of a non-existent g-color-in-palette: %s",self,this.colorDerivedFromId)
      }
    }
    else {
      this.$linkMessageAlgorithm.textContent = ""
      this.$linkMessage.hide()
    }
  }

  static tagName = "g-color-in-palette"
  static define() {
    customElements.define(this.tagName, ColorInPaletteComponent);
  }
}
HasTemplate.mixInto(ColorInPaletteComponent)
HasAttributes.mixInto(ColorInPaletteComponent)
HasEvents.mixInto(ColorInPaletteComponent)
IsCreatable.mixInto(ColorInPaletteComponent)
export default ColorInPaletteComponent
