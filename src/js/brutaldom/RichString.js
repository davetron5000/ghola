export default class RichString {
  static fromString(possiblyDefinedStringOrRichString) {
    if (possiblyDefinedStringOrRichString instanceof RichString) {
      return possiblyDefinedStringOrRichString
    }
    if (!possiblyDefinedStringOrRichString) {
      return null
    }
    return new RichString(String(possiblyDefinedStringOrRichString))
  }

  constructor(string) {
    if (typeof string !== "string") {
      throw `You may only construct a RichString with a String, not a ${typeof string}`
    }
    this.string = string
  }

  capitalize() {
    return new RichString(this.string.charAt(0).toUpperCase() + this.string.slice(1))
  }
  decapitalize() {
    return new RichString(this.string.charAt(0).toLowerCase() + this.string.slice(1))
  }

  camelize() {
    // Taken from camelize npm module
    return RichString.fromString(this.string.replace(/[_.-](\w|$)/g, function (_, x) {
      return x.toUpperCase()
    }))
  }

  humanize() {
    return this.decamlize({spacer: " "}).capitalize()
  }

  decamlize({spacer="_"} = {}) {
    // Taken from decamelize NPM module

    // Checking the second character is done later on. Therefore process shorter strings here.
    if (this.string.length < 2) {
      return new RichString(this.string.toLowerCase())
    }

    const replacement = `$1${spacer}$2`

    // Split lowercase sequences followed by uppercase character.
    // `dataForUSACounties` → `data_For_USACounties`
    // `myURLstring → `my_URLstring`
    const decamelized = this.string.replace(
      /([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu,
      replacement,
    )

    // Split multiple uppercase characters followed by one or more lowercase characters.
    // `my_URLstring` → `my_ur_lstring`
    return new RichString(decamelized.
      replace(
        /(\p{Uppercase_Letter})(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu,
        replacement,
      ).
      toLowerCase()
    )
  }

  toString() { return this.string }
  toStringOrNull() {
    if (this.string.trim() == "") {
      return null
    }
    else {
      return this.string
    }
  }

}
