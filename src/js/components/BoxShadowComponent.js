
import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class BoxShadowComponent extends BaseCustomElement {

  static tagName = "g-box-shadow"
  static observedAttributes = [
    "offset-x",
    "offset-y",
    "blur-radius",
    "spread-radius",
    "inset",
    "color",

    "derived-from",
    "raise-by",

    "show-warnings",
  ]

  attributeChangedCallback(name,oldValue,newValue) {
    const returnValue = super.attributeChangedCallback(name,oldValue,newValue)
    this.dispatchEvent(new CustomEvent("attributeChanged"))
    return returnValue
  }

  derivedFromChangedCallback({newValue}) {
    this.derivedBoxShadowId = newValue
  }

  raiseByChangedCallback({newValue}) {
    this.raiseBy = this._requireRawNumber(newValue,1)
  }

  offsetXChangedCallback({newValue}) {
    this.offsetX = this._requireRawNumber(newValue)
  }

  offsetYChangedCallback({newValue}) {
    this.offsetY = this._requireRawNumber(newValue)
  }

  blurRadiusChangedCallback({newValue}) {
    this.blurRadius = this._requireRawNumber(newValue)
  }

  spreadRadiusChangedCallback({newValue}) {
    this.spreadRadius = this._requireRawNumber(newValue)
  }

  colorChangedCallback({newValue}) {
    this.color = newValue
  }
  insetChangedCallback({newValue}) {
    this.inset = newValue || newValue == ""
  }

  constructor() {
    super()
    this.spreadRadius = 0
    this.blurRadius = 0
    this.offsetY = 0
    this.offsetX = 0
    this.color = "black"
    this.attributeChangedListener = (event) => {
      this.render()
    }
  }

  get adjustment() {
    if (this.raiseBy) {
      if (this.insetValue == "inset") {
        return this.raiseBy * 0.5
      }
      else {
        return this.raiseBy
      }
    }
  }

  get offsetXPx() {
    return this._derivedBoxShadowValue("offsetX") + "px"
  }

  get offsetYPx() {
    return this._derivedBoxShadowValue("offsetY") + "px"
  }

  get blurRadiusPx() {
    return this._derivedBoxShadowValue("blurRadius",(x) => x * this.adjustment) + "px"
  }

  get spreadRadiusPx() {
    return this._derivedBoxShadowValue(
      "spreadRadius",
      (x) => {
        return x * (this.adjustment / (Math.log(this.adjustment) + 1))
      }
    ) + "px"
  }

  get shadowColor() {
    const value = this._derivedBoxShadowValue("color")
    const gray = parseInt(value)
    if (isNaN(gray)) {
      return value
    }
    else if ((gray >= 0) && (gray < 256)) {
      return `rgb(${gray},${gray},${gray})`
    }
    else {
      this.logger.warn(`Color value '${value}' isn't a hexcode nor a shade of gray between 0 and 255`)
      return 0;
    }
  }

  get insetValue() {
    return this._derivedBoxShadowValue("inset",null,false) ? "inset" : ""
  }

  get derivedElement() {
    return document.getElementById(this.derivedBoxShadowId)
  }
  _derivedBoxShadowValue(attr,f=null,warnOnNoValue=true) {
    const element = this.derivedElement
    if (element) {
      if (element[attr] || element[attr] == 0) {
        if (f) {
          return f(element[attr])
        }
        else {
          return element[attr]
        }
      }
      else {
        if (warnOnNoValue) {
          this.logger.warn(`Found derived-by with id '${this.derivedBoxShadowId}', but it had no value for '${attr}', so using fallback`)
        }
      }
    }
    else if (this.derivedBoxShadowId) {
      this.logger.warn(`Did not find element with id '${this.derivedBoxShadowId}'`)
    }
    return this[attr]
  }

  render() {
    if (this.children.length == 0) {
      this.logger.warn("No children, so nothing to apply a shadow to")
      return
    }
    if (this.derivedElement) {
      this.derivedElement.addEventListener("attributeChanged",this.attributeChangedListener)
    }
    Array.from(this.children).forEach( (element) => {
      element.style.boxShadow = [
        this.offsetXPx,
        this.offsetYPx,
        this.blurRadiusPx,
        this.spreadRadiusPx,
        this.shadowColor,
        this.insetValue,
      ].join(" ")
    })
  }

  _requireRawNumber(value,defaultValue=0) {
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue)) {
      this.logger.warn(`Value '${value}' is not a number and will be ignored`)
      return defaultValue
    }
    return parsedValue
  }
}
