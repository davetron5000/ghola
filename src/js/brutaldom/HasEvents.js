import RichString from "./RichString"
import MethodMeasurement from "./MethodMeasurement"

const makeDebounced = function(callback, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(context, args)
    }, wait)
  }
}

const hasEventsMixin = {
  removeEventListeners() {
    if (!this.eventListeners) {
      return
    }
    for (const [eventName,listeners] of Object.entries(this.eventListeners)) {
      listeners.forEach( (listener) => {
        this.removeEventListener(eventName,listener)
      })
    }
  }
}
const HasEvents = {
  mixInto(klass) {
    if (!klass.events) {
      throw `In ${klass.name} You must define a static events object to configure which events you expose`
    }
    const debug = klass.DEBUG_EVENTS
    for (const [key,value] of Object.entries(klass.events)) {
      const captializedKey = new RichString(key).capitalize()
      const onMethodName = `on${captializedKey}`
      const dispatchMethodName = `dispatch${captializedKey}`

      if (klass.prototype[onMethodName]) {
        throw `${klass.name} already has a method named ${onMethodName}, which clases with the event ${key}`
      }

      if (klass.prototype[dispatchMethodName]) {
        throw `${klass.name} already has a method named ${dispatchMethodName}, which clases with the event ${key}`
      }

      klass.prototype[onMethodName] = function(listener, { debounce } = {}) {
        const measurement = new MethodMeasurement(performance,this,onMethodName)
        if (!this.eventListeners) {
          this.eventListeners = {}
        }
        if (!this.eventListeners[key]) {
          this.eventListeners[key] = []
        }
        if (debounce) {
          if (typeof debounce !== "number") {
            debounce = 500
          }
          listener = makeDebounced(listener,debounce)
        }
        this.addEventListener(key,listener)
        this.eventListeners[key].push(listener)
        measurement.done()
      }
      const dispatchFunction = function(detail) {
        const measurement = new MethodMeasurement(performance,this,dispatchMethodName)
        if (debug) {
          console.log(`${this.constructor.name} is dispatching ${key} with details %o`,detail)
        }
        this.dispatchEvent(new CustomEvent(key, { detail }))
        measurement.done()
      }
      klass.prototype[dispatchMethodName] = dispatchFunction
    }
    Object.assign(klass.prototype,hasEventsMixin)
  }

}

export default HasEvents
