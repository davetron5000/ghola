import Logger from "../brutaldom/Logger"
import RichString from "../brutaldom/RichString"

export default class BaseCustomElement extends HTMLElement {
  constructor() {
    super()
    this.logger = Logger.forPrefix(null)
  }

  debugChangedCallback({oldValue,newValue}) {
    let oldLogger
    if (!oldValue && newValue) {
      oldLogger = this.logger
    }
    const prefix = newValue == "" ? this.id : newValue
    this.logger = Logger.forPrefix(prefix)
    if (oldLogger) {
      this.logger.dump(oldLogger)
    }
  }

  attributeChangedCallback(name,oldValue,newValue) {
    const callbackName = `${new RichString(name).camelize()}ChangedCallback`
    if (this[callbackName]) {
      this[callbackName]({oldValue,newValue})
    }
    else if (this.constructor.observedAttributes.indexOf(name) != -1) {
      console.warn("Observing %s but no method named %s was found to handle it",name,callbackName)
    }
    if (this.render) {
      this.render()
    }
  }
}
