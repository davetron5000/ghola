export default class HTMLId {
  static REGEXP = new RegExp("^[A-Za-z][A-Za-z0-9_\-]+$")

  static fromString(anyString, { prefix } = {}) {
    let normalized = anyString.toString().replaceAll(/[^A-Za-z0-9_\-]/g,"-")
    if (!normalized[0]) {
      throw `'${anyString}' could not be made into an HTMLId`
    }
    if (normalized[0].match(/^[0-9_\-]/)) {
      normalized = `id${normalized}`
    }
    if (prefix) {
      normalized = `${prefix}-${normalized}`
    }
    return new HTMLId(normalized)
  }
  constructor(id) {
    if (!id.match(HTMLId.REGEXP)) {
      throw `'${id}' is not a wise HTML id attribute value. Should be only ASCII letters, digits, -, or _ and start with a letter`
    }
    this.id = id
  }
  toString() { return this.id }
}
