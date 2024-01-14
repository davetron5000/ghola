import BaseCustomElement from "../brutaldom/BaseCustomElement"

import ColorNameComponent   from "./ColorNameComponent"
import ColorSwatchComponent from "./ColorSwatchComponent"
import ColorScale           from "../color-scales/ColorScale"
import Color                from "../Color"

class SpecialButtons {
  constructor(parentElement, selector, clickListener) {
    this.parentElement = parentElement
    this.selector = selector
    this.clickListener = clickListener
  }
  enable()  { this.forEach( (e) => e.removeAttribute("disabled")   ) }
  disable() { this.forEach( (e) => e.setAttribute("disabled",true) ) }
  addEventListeners() {
    this.forEach( (e) => e.addEventListener("click", this.clickListener) )
  }
  forEach(f) {
    return this.parentElement.querySelectorAll(this.selector).forEach(f)
  }

  dispatchEvent(name,detail) {
    return this.parentElement.dispatchEvent(
      new CustomEvent(name,{ bubbles: true, cancelable: true, detail: detail })
    )
  }
}

class PreviewButtons extends SpecialButtons {
  constructor(parentElement) {
    super(parentElement,"[data-preview]",() => {
      const detail = {
        colorName: parentElement.colorName,
        colorNameUserOverride: parentElement.colorNameUserOverride,
        colorScale: parentElement.colorScale,
        baseColor: parentElement.baseColorSwatch.hexCode,
      }
      this.dispatchEvent("preview", detail)
    })
  }
}

class UnlinkButtons extends SpecialButtons  {
  constructor(parentElement) {
    super(parentElement,"[data-unlink]",() => {
      const defaultNotPrevented = this.dispatchEvent("unlink")
      if (defaultNotPrevented) {
        parentElement.removeAttribute("linked-to-primary")
        if (parentElement.baseColorSwatch) {
          parentElement.baseColorSwatch.removeAttribute("derived-from")
          parentElement.baseColorSwatch.removeAttribute("derivation-algorithm")
          parentElement.baseColorSwatch.querySelectorAll("input[type=color][disabled]").forEach( (input) => {
            input.removeAttribute("disabled")
          })
        }
      }
    })
  }
}

class RemoveButtons extends SpecialButtons {
  constructor(parentElement) {
    super(parentElement,"[data-remove]",() => {
      const defaultNotPrevented = this.dispatchEvent("remove")
      if (defaultNotPrevented) {
        parentElement.parentElement.removeChild(parentElement)
      }
    })
  }
}

export default class PaletteColorComponent extends BaseCustomElement {
  static tagName = "g-palette-color-scale"
  static observedAttributes = [
    "primary",
    "linked-to-primary",
    "scale-algorithm",
    "show-warnings",
  ]

  constructor() {
    super()

    this.previewButtons = new PreviewButtons(this)
    this.unlinkButtons = new UnlinkButtons(this)
    this.removeButtons = new RemoveButtons(this)

    this.baseColorChangedEventHandler = (event) => {
      if (!this.linkedPrimaryAlgorithm) {
        this.dispatchEvent(new CustomEvent("base-color-changed", { cancelable: false, bubbles: true }))
      }
    }

  }

  primaryChangedCallback({newValue}) {
    this.isPrimary = String(newValue) === ""
    if ( (newValue != "") && (newValue != null) ){
      this.logger.warn("primary should either be present or omitted, not '%s'",newValue)
    }
  }

  linkedToPrimaryChangedCallback({newValue}) {
    this.linkedPrimaryAlgorithm = newValue
  }

  scaleAlgorithmChangedCallback({newValue}) {
    this.scaleAlgorithm = newValue
  }

  render() {
    this._configureButtons()
    this._configureLink()
    this._configureScale()
  }

  get swatches() {
    return this.querySelectorAll(ColorSwatchComponent.tagName)
  }

  get baseColorSwatch() {
    const middle = (this.swatches.length - 1) / 2

    return this.swatches[middle]
  }

  _configureScale() {
    let id = this.baseColorSwatch.id
    if (!id) {
      id = `${ColorSwatchComponent.tagName}-${crypto.randomUUID()}-generated`
      this.baseColorSwatch.id = id
    }
    
    if (this.linkedPrimaryElement) {
      if (this.linkedPrimaryElement.baseColorSwatch) {
        this.baseColorSwatch.setAttribute("derived-from",this.linkedPrimaryElement.baseColorSwatch.id)
        if (this.linkedPrimaryAlgorithm) {
          this.baseColorSwatch.setAttribute("derivation-algorithm",this.linkedPrimaryAlgorithm)
        }
      }
      else {
        this.logger.warn("Linked g-palette-color-scale (%s) has no base color, so we cannot link to it",this.linkedPrimaryElement.id)
      }
    }

    const algorithm = ColorScale.fromString(this.scaleAlgorithm)

    if (algorithm.isFallback && this.scaleAlgorithm) {
      this.logger.warn(`No such algorithm for derive-color-scale '${this.scaleAlgorithm}'`)
    }
    this.swatches.forEach( (swatch,index,array) => {
      if (swatch != this.baseColorSwatch) {
        if (!swatch.getAttribute("derived-from")) {
          swatch.setAttribute("derived-from",id)
        }
        if (!swatch.getAttribute("derivation-algorithm")) {
          swatch.setAttribute("derivation-algorithm","brightness")
        }
        const [ attribute, value ] = algorithm.valueFor(index,array.length)
        if (attribute && !swatch.getAttribute(attribute)) {
          swatch.setAttribute(attribute,`${Math.floor(value)}%`)
        }
      }
    })
    this.baseColorSwatch.addEventListener("hex-code-change",this.baseColorChangedEventHandler)
  }

  _configureButtons() {
    if (this.isPrimary) {
      this.previewButtons.enable()
      this.unlinkButtons.disable()
      this.removeButtons.disable()
    }
    else if ( this.linkedPrimaryAlgorithm ){
      this.previewButtons.enable()
      this.unlinkButtons.enable()
      this.removeButtons.enable()
    }
    else {
      this.previewButtons.enable()
      this.unlinkButtons.disable()
      this.removeButtons.enable()
    }
    this.previewButtons.addEventListeners()
    this.unlinkButtons.addEventListeners()
    this.removeButtons.addEventListeners()
  }

  _configureLink() {
    if (this.linkedPrimaryAlgorithm) {
      this.linkedPrimaryElement = this.parentElement ? this.parentElement.querySelector(`${this.constructor.tagName}[primary]`) : null
      if (!this.linkedPrimaryElement) {
        if (this.parentElement) {
          this.logger.warn("linked-to-primary had a value ('%s') but no sibling is marked as primary",this.linkedPrimaryAlgorithm)
        }
        else {
          this.logger.warn("linked-to-primary had a value ('%s') but we have no parent element",this.linkedPrimaryAlgorithm)
        }
      }
    }
  }

  get colorName() {
    const colorName = this.querySelector(ColorNameComponent.tagName)
    if (colorName) {
      return colorName.name
    }
    else {
      return null
    }
  }

  overrideColorName(newName) {
    const colorName = this.querySelector(ColorNameComponent.tagName)
    if (colorName) {
      return colorName.overrideColorName(newName)
    }
    else {
      return null
    }
  }

  get colorNameUserOverride() {
    const colorName = this.querySelector(ColorNameComponent.tagName)
    return colorName && colorName.userOverride
  }

  get colorScale() {
    return Array.from(this.querySelectorAll(ColorSwatchComponent.tagName)).map( (element) => {
      return element.hexCode
    })
  }

  static cloneAndAppend(paletteElement,{linkAlgorithm=false,hexCode=null}={}) {
    const primary = paletteElement.querySelector(this.tagName + "[primary]")
    if (!primary) {
      this.logger.warn("Palette has no primary color scale, so there is no reference to duplicate when adding a new scale")
      return
    }
    if (linkAlgorithm && paletteElement.querySelector(this.tagName + `[linked-to-primary='${linkAlgorithm}']`)) {
      return
    }
    const newScale = primary.cloneNode(true)
    newScale.removeAttribute("primary")
    newScale.baseColorSwatch.removeAttribute("id") // force the scale to generate one
    if (linkAlgorithm) {
      newScale.baseColorSwatch.querySelectorAll("input[type=color]").forEach( (input) => {
        input.setAttribute("disabled",true)
      })
    }
    newScale.swatches.forEach( (swatch) => swatch.removeAttribute("derived-from") )

    paletteElement.appendChild(newScale)

    if (linkAlgorithm) {
      newScale.baseColorSwatch.removeAttribute("hex-code")
      newScale.setAttribute("linked-to-primary",linkAlgorithm)
    }
    else {
      if (hexCode) {
        newScale.baseColorSwatch.setAttribute("hex-code", hexCode)
      }
      else {
        newScale.baseColorSwatch.setAttribute("hex-code", Color.random().hexCode())
      }
    }

    newScale.querySelectorAll(ColorNameComponent.tagName).forEach( (colorName) => {
      if (colorName.getAttribute("color-swatch") == primary.baseColorSwatch.id) {
        colorName.setAttribute("color-swatch",newScale.baseColorSwatch.id)
        colorName.restoreDefaultColorName()
      }
    })
    return newScale
  }
}
