import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class AttributeCheckboxComponent extends BaseCustomElement {

  static tagName = "g-attribute-checkbox"
  static observedAttributes = [
    "element",
    "attribute-name",
    "debug",
  ]

  constructor() {
    super()
    this.checkboxChangeListener = (event) => {
      this._updateElement()
    }
  }

  elementChangedCallback({newValue}) {
    if (newValue) {
      this.element = document.getElementById(newValue)
      if (this.isConnected && !element) {
        this.logger.warn("No such element in the document with id '%s'",newValue)
      }
    }
    else {
      this.element = null
      this.checkbox.removeEventListener("change",this.checkboxChangeListener)
    }
  }

  attributeNameChangedCallback({newValue}) {
    this.attributeName = newValue
  }

  render() {
    this.checkbox.addEventListener("change",this.checkboxChangeListener)
    this._updateElement()
  }

  _updateElement() {
    if (this.element && this.attributeName) {
      if (this.checkbox.checked) {
        this.element.setAttribute(this.attributeName,true)
      }
      else {
        this.element.removeAttribute(this.attributeName)
      }
    }

  }

  get checkbox() {
    const checkboxes = this.querySelectorAll("input[type=checkbox]")
    if (checkboxes.length == 0) {
      this.logger.warn("No checkboxes found inside element")
      return
    }
    if (checkboxes.length > 1) {
      this.logger.warn("More than one checkbox found - behavior is not defined")
    }
    return checkboxes[0]
  }

}
