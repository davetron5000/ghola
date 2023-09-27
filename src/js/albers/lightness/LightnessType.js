export default class LightnessType {
  static dark()  { return new LightnessType("dark") }
  static light() { return new LightnessType("light") }

  constructor(string) {
    if (string == "dark") {
      this.string = string
    }
    else if (string == "light") {
      this.string == string
    }
    else {
      throw `${string} is not a valid LightnessType`
    }
  }

  isDark()   { return this.string == "dark" }
  toString() { return this.string }
}
