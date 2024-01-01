import RichString        from "./RichString"
import TypeOf            from "./TypeOf"
import MethodMeasurement from "./MethodMeasurement"

const noop = () => {}

const hasAttributesMixin = {
  attributeChangedCallback(name, oldValue, newValue) {
    const measurement = new MethodMeasurement(performance,this,"attributeChangedCallback",{attributeName: name})
    const valueChanged = oldValue !== newValue
    const attributeListeners = this.constructor.attributeListeners
    if (attributeListeners && attributeListeners[name]) {
      const attributeName = attributeListeners[name].attributeName || new RichString(name).camelize()
      const klass = attributeListeners[name].klass
      const debug = attributeListeners[name].debug || this.constructor.DEBUG_ATTRIBUTES
      if (debug) {
        if (newValue == "null") {
          throw `something is wrong settign ${name} to the string 'null'`
        }
        console.log(`${this.constructor.name}: %s changed from %s[%s] to %s[%s] (%s)`,name,oldValue,TypeOf.asString(oldValue),newValue,TypeOf.asString(newValue), valueChanged ? 'render will be called' : 'render will be skipped')
        console.log(`${this.constructor.name}: Using %o to set %s`,klass, attributeName)
      }
      if (newValue) {
        if (klass) {
          if (klass === Boolean) {
            this[attributeName] = newValue === "true"
          }
          else {
            this[attributeName] = new klass(newValue)
          }
        }
        else {
          this[attributeName] = newValue
        }
      }
      else {
        this[attributeName] = newValue
      }
    }
    if (valueChanged) {
      if (this.render) {
        measurement.measureCode("render", () => this.render() )
      }
    }
    measurement.done()
  }
}
const HasAttributes = {
  mixInto(klass) {
    if (!klass.observedAttributes || !klass.observedAttributes.length || klass.observedAttributes.length == 0) {
      klass.observedAttributes = Object.keys(klass.attributeListeners)
    }
    Object.assign(klass.prototype,hasAttributesMixin)
  }

}

export default HasAttributes
