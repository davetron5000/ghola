class PrettifiedHTML {
  constructor(string) {
    this._string = String(string)
    this.prettified = null
  }

  set string(newValue) {
    this._string = newValue
    this.prettified = null
  }

  get string() { return this._string }

  toString() {
    if (!this.prettified) {
      const splitted = this._mergeAttributesWithElements(this.string)

      this.prettified = this._addIndentation(splitted)
    }
    return this.prettified
  }
  /** Adapted from html-prettify npm module */
  _mergeAttributesWithElements(markup) {
    const splittedMarkup = markup.trim().replace(/(^(\s|\t)+|(( |\t)+)$)/gm, "").split("\n")

    const mergedLines = []
    let currentElement = ""
    for (let i = 0; i < splittedMarkup.length; i += 1) {
      const line = splittedMarkup[i]

      if (line.endsWith("/>")) {
        mergedLines.push(`${currentElement}${line.slice(0, -2)} />`)
        currentElement = ""
        continue
      }

      if (line.endsWith(">")) {
        mergedLines.push(`${currentElement}${
        line.startsWith(">") || line.startsWith("<") ? "" : " "
      }${line}`)
        currentElement = ""
        continue
      }

      currentElement += currentElement.length ? ` ${line}` : line
    }

    return mergedLines
  }

  /** Adapted from html-prettify npm module */
  _addIndentation(splittedHtml) {
    const char = " "
    const count = 2

    let level = 0
    const opened = []

    return splittedHtml.reverse().reduce((indented, elTag) => {
      if (opened.length
        && level
        && opened[level]
        && opened[level] === elTag.substring(1, opened[level].length + 1)
      ) {
        opened.splice(level, 1)
        level--
      }

      const indentation = char.repeat(level ? level * count : 0)

      const newIndented = [
        `${indentation}${elTag}`,
        ...indented,
      ]

      if (elTag.substring(0, 2) === "</") {
        level++
        opened[level] = elTag.substring(2, elTag.length - 1)
      }

      return newIndented
    }, []).join("\n")
  }
}

export default class ElementSourceComponent extends HTMLElement {
  static observedAttributes = [
    "element-id",
    "element-sibling",
    "html",
  ]

  constructor() {
    super()
    this.htmlToShow = "outer"
  }

  connectedCallback() {
    this.$code = this.querySelector("code")
    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "element-id") {
      this.element = document.getElementById(newValue)
    }
    else if (name == "element-sibling") {
      this.element = this.parentElement.querySelector(newValue)
    }
    else if (name == "html") {
      this.htmlToShow = newValue
    }
    this.render()
  }

  render() {
    if (this.element && this.$code) {
      this.$code.innerText = 
        new PrettifiedHTML(
          this.htmlToShow == "inner" ? this.element.innerHTML : this.element.outerHTML
        ).toString()
    }
  }

  static tagName = "g-element-source"
  static define() {
    customElements.define(this.tagName, ElementSourceComponent)
  }
}

