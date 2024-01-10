export default class BaseGradient {
  get isFallback() { return false }
  valueFor() {
    throw "Subclass must implement"
  }
}
