export default class PaletteEntry {
  constructor({hexCode,userSuppliedName,algorithm}) {
    if (hexCode && algorithm) {
      throw `You may not provide both hexCode and algorithm`
    }
    else if (!hexCode && !algorithm) {
      throw `You must provide hexCode or algorithm`
    }
    this.hexCode = hexCode
    this.userSuppliedName = userSuppliedName
    this.algorithm = algorithm
  }

  get colorNameUserOverride() {
    return !!this.userSuppliedName
  }
  whenHexCode(f) {
    if (this.hexCode) {
      f(this.hexCode)
    }
  }
  whenAlgorithm(f) {
    if (this.algorithm) {
      f(this.algorithm)
    }
  }
  whenNameUserOverride(f) {
    if (this.colorNameUserOverride) {
      f(this.userSuppliedName)
    }
  }
  whenNameDefault(f) {
    if (!this.colorNameUserOverride) {
      f()
    }
  }
}
