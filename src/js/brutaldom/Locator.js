class NoMatchingElements extends Error {
  constructor(element,selector) {
    super(`No elements matching '${selector}' from ${element.tagName}:\n${element.outerHTML}`)
    this.element = element
    this.selector = selector
  }
}

class TooManyMatchingElements extends Error {
  constructor(element,selector,numMatches) {
    super(`Found ${numMatches} elements matching '${selector}' instead of exactly one from ${element.tagName}:\n${element.outerHTML}`)
    this.element = element
    this.selector = selector
  }
}

export default class Locator {
  constructor(element) {
    this.element = element
  }
  $e(selector) {
    const matches = this.element.querySelectorAll(selector)
    if (matches.length == 1) {
      return matches[0]
    }
    if (matches.length == 0) {
      throw new NoMatchingElements(this.element,selector)
    }
    throw new TooManyMatchingElements(this.element,selector,matches.length)
  }
}
