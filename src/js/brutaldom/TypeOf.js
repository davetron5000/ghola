/**
 * Given an object, attempts to return a string that names its type or class.
 *
 */
class TypeOf {
  /**
   * Get the type of the given value.  This will check if its a function, and use the name. If it has a constructor, it will use
   * that constructor's name, otherwise it will use whatever typeof returns.  This will swallow any errors.
   *
   * @param {Object} value - anything
   */
  constructor(value) {
    this.typeName = typeof value
    if (value === null) {
      this.typeName = "null"
    }

    try {
      if ( ( (typeof value) === "function") && value.name ) {
        this.typeName = value.name
      }
      else if (value && value.constructor && value.constructor.name) {
        this.typeName = value.constructor.name
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  /** @returns {String} the string for the name of this type */
  toString() { return this.typeName }

  /** @returns the String of a value, skipping the need to create and hold onto an instance of this class */
  static asString(value) {
    return new TypeOf(value).toString()
  }
}
export default TypeOf
