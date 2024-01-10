import BaseGradient from "./BaseGradient"
export default class NoGradient extends BaseGradient {
  get isFallback() { return true }
  valueFor() {
    return []
  }
}

