import BaseDerivation from "./BaseDerivation"
import ComplementaryDerivation from "./ComplementaryDerivation"
import { AnalogousUpperDerivation, AnalogousLowerDerivation } from "./AnalogousDerivation"

class SplitComplementaryUpperDerivation extends BaseDerivation {
  constructor() {
    super()
    this.complementary = new ComplementaryDerivation()
    this.analogousUpper = new AnalogousUpperDerivation()
  }

  derive(hexCode,options={}) {
    return this.analogousUpper.derive(this.complementary.derive(hexCode))
  }
}

class SplitComplementaryLowerDerivation extends BaseDerivation {
  constructor() {
    super()
    this.complementary = new ComplementaryDerivation()
    this.analogousLower = new AnalogousLowerDerivation()
  }

  derive(hexCode,options={}) {
    return this.analogousLower.derive(this.complementary.derive(hexCode))
  }
}
export {
  SplitComplementaryLowerDerivation,
  SplitComplementaryUpperDerivation,
}
