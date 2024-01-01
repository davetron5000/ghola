import Locator from "./Locator"

export default class NonCustomElement extends EventTarget {
  static wrap(element) {
    const wrappingElement = new this(element)
    Object.getOwnPropertyNames(this.prototype).
      filter( (propertyName) => propertyName !== "constructor" ).
      filter( (propertyName) => typeof this.prototype[propertyName] === "function" ).
      forEach( (propertyName) => {
        if (element[propertyName]) {
          throw `Element ${element.tagName} (of class ${element.constructor.name}) has a property named ${propertyName} - you must rename it on your class named ${this.name}`
        }
        element[propertyName] = wrappingElement[propertyName].bind(wrappingElement)
      })
    element._wrappingElement = wrappingElement
    return element
  }
  constructor(element) {
    super()
    if (! (element instanceof Element) ) {
      throw `You may only construct a ${this.constructor.name} from an Element or its descendants`
    }
    this.element = element
    this.locator = new Locator(this.element)
  }
}
