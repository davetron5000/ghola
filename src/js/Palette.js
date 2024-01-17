export default class Palette {

  constructor(primaryColor,otherColors,compact) {
    this.primaryColor = primaryColor
    this.otherColors = otherColors || []
    this.compact = !!compact
  }

  withPrimaryColor(f) {
    if (this.primaryColor) {
      this.primaryColor.whenHexCode(f)
    }
  }
  whenPrimaryNameUserOverride(f) {
    if (this.primaryColor) {
      this.primaryColor.whenNameUserOverride(f)
    }
  }
  whenPrimaryNameDefault(f) {
    if (this.primaryColor) {
      this.primaryColor.whenNameDefault(f)
    }
  }
}
