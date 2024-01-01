const isCreatableMixin = {
}
const IsCreatable = {
  mixInto(klass) {
    if (klass.appendNewChild) {
      throw `${klass} already has appendNewChild defined`
    }
    Object.assign(klass.prototype,isCreatableMixin)
    klass.appendNewChild = (element,attributes) => {
      const newElement = document.createElement(klass.tagName)
      element.appendChild(newElement)
      for(const [attributeName, value] of Object.entries(attributes) ) {
        newElement.setAttribute(attributeName, value)
      }
      return newElement
    }
  }

}

export default IsCreatable
