import BrightnessDerivation from "./BrightnessDerivation"
import ComplementaryDerivation from "./ComplementaryDerivation"
import {
  SplitComplementaryUpperDerivation,
  SplitComplementaryLowerDerivation,
} from "./SplitComplementaryDerivation"
import {
  AnalogousUpperDerivation,
  AnalogousLowerDerivation,
} from "./AnalogousDerivation"
import {
  TriadUpperDerivation,
  TriadLowerDerivation,
} from "./TriadDerivation"

export default class DerivationAlgorithm {
  static fromString(string, { throwOnUnknown=false } = {}) {
    if (string instanceof DerivationAlgorithm) {
      return string
    }
    else if (string == "brightness") {
      return new BrightnessDerivation()
    }
    else if (string == "complement") {
      return new ComplementaryDerivation()
    }
    else if (string == "split-complement-lower") {
      return new SplitComplementaryLowerDerivation()
    }
    else if (string == "split-complement-upper") {
      return new SplitComplementaryUpperDerivation()
    }
    else if (string == "analogous-lower") {
      return new AnalogousLowerDerivation()
    }
    else if (string == "analogous-upper") {
      return new AnalogousUpperDerivation()
    }
    else if (string == "triad-lower") {
      return new TriadLowerDerivation()
    }
    else if (string == "triad-upper") {
      return new TriadUpperDerivation()
    }
    else {
      if (throwOnUnknown) {
        throw `No such DerivationAlgorithm '${string}'`
      }
      else {
        return null
      }
    }
  }
}
