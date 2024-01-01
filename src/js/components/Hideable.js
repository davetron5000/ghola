import TypeOf from "../brutaldom/TypeOf"

const hideableMixin = {
  hide() { 
    this._displayValueWhenShown() // force figuring this out
    if (!this.__hideableMixin_hideable) {
      this._wrappedElement().style.display = "none"
      this.__hideableMixin_hideable = true
    }
  },
  show() {
    if (this.__hideableMixin_hideable) {
      this._wrappedElement().style.display = this._displayValueWhenShown()
      this.__hideableMixin_hideable = false
    }
  },
  _wrappedElement() {
    return this.element || this.$element
  },
  _displayValueWhenShown() {
    if (!this.__hideableMixin_display) {
      if (!this._wrappedElement()) {
        console.log("%o",this)
        window.blah = this
        throw `WTF`
      }
      this.__hideableMixin_display = window.getComputedStyle(this._wrappedElement()).display
      this.__hideableMixin_hideable  = this.__hideableMixin_display === "none"
      if (this.__hideableMixin_hideable) {
        this.__hideableMixin_display = this.element.dataset["brutaldomDisplay"]
        if (!this.__hideableMixin_display) {
          throw `If your element is hidden by default, you must set data-brutaldom-display to the display value you want to use when showing it.`
        }
      }
    }
    return this.__hideableMixin_display
  }
}

const HideableElement = {
  mixInto(klass) {
    Object.assign(klass.prototype,hideableMixin)
  },
  addTo(object) {
    Object.entries(hideableMixin).forEach( ([method,impl]) => {
      if (object.method) {
        throw `Object of type ${TypeOf.asString(object)} implements ${method} already and cannot have HideableElement added onto it`
      }
      object[method] = impl.bind(object)
    })
    if (object.$element) {
      object._wrappedElement = () => { return object.$element }
    }
    else if (!object.element) {
      object._wrappedElement = () => { return object }
    }
  }
}

export default HideableElement
