import Locator from "./Locator"
import MethodMeasurement from "./MethodMeasurement"

const hasTemplateMixin = {
  addNodeFromTemplate({ childTagName, before, after } = {}) {
    const measurement = new MethodMeasurement(performance,this,"addNodeFromTemplate")
    const node = this._newNodeFromTemplate()
    this.$element = node.firstElementChild

    this.appendChild(node)

    if (this.afterAppendTemplate) {
      measurement.measureCode("afterAppendTemplate", () => {
        this.afterAppendTemplate({ element: this.$element, locator: new Locator(this.$element), measurement: measurement} )
      })
    }

    if (this.render) {
      measurement.measureCode("render", () => {
        this.render({measurement:measurement})
      })
    }

    if (this.afterRenderTemplate) {
      measurement.measureCode("afterRenderTemplate", () => {
        this.afterRenderTemplate({ element: this.$element, locator: new Locator(this.$element), measurement: measurement })
      })
    }
    measurement.done()
  },
  _newNodeFromTemplate({ childTagName } = {}) {
    if (!this.templateContent) {
      const $template = document.getElementById(this.constructor.tagName)
      if (!$template) {
        throw `Expected to find template with id '${this.constructor.tagName}' but none was found`
      }
      this.templateContent = $template.content
    }
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id '${this.constructor.tagName}' has ${node.childElementCount} children, but must have exactly 1`
    }
    if (childTagName) {
      childTagName = childTagName.toUpperCase()
      if (node.firstElementChild.tagName != childTagName) {
        throw `<template> with id '${this.constructor.tagName}' is missed up - should be a <${childTagName}>, but is a <${node.firstElementChild.tagName}>`
      }
    }
    return node
  }
}
const HasTemplate = {
  mixInto(klass) {
    if (!klass.tagName) {
      throw `${klass.name} cannot be mixed into HasTemplate since it doesn't have a static member 'tagName'`
    }
    Object.assign(klass.prototype,hasTemplateMixin)
    if (!klass.prototype.connectedCallback) {
      klass.prototype.connectedCallback = klass.prototype.addNodeFromTemplate
    }
  }
}

export default HasTemplate
