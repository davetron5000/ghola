import LinearGradient      from "./LinearGradient"
import ExponentialGradient from "./ExponentialGradient"
import NoGradient          from "./NoGradient"

export default class ColorScale {
  static fromString(string) {
    if (string == "linear") {
      return new LinearGradient()
    }
    if (string == "exponential") {
      return new ExponentialGradient()
    }
    return new NoGradient()
  }
}
