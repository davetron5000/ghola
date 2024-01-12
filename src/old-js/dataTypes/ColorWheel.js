import Color from "./Color"
import RichString from "../brutaldom/RichString"

class Algorithm { 
  toString() {
    return RichString.fromString(this.constructor.name).decapitalize().toString()
  }
}

class Analogous1 extends Algorithm {
  deriveFrom(color) {
    const [h,s,l] = color.hsl()
    const newH = (h + this._offset())  % 360

    return Color.fromHSL(newH,s,l)
  }

  _offset() { return 30 }
}

class Analogous2 extends Analogous1 {
  _offset() { return 330 }
}

class Complement extends Algorithm {
  deriveFrom(color) {
    const [h,s,l] = color.hsl()
    const newH = (h + 180) % 360
    return Color.fromHSL(newH,s,l)
  }
}

class SplitComplement1 extends Algorithm {
  deriveFrom(color) {
    const complement = new Complement().deriveFrom(color)
    return new Analogous1().deriveFrom(complement)
  }
}
class SplitComplement2 extends Algorithm {
  deriveFrom(color) {
    const complement = new Complement().deriveFrom(color)
    return new Analogous2().deriveFrom(complement)
  }
}
class Triad1 extends Algorithm {
  deriveFrom(color) {
    const [h,s,l] = color.hsl()
    const newH = (h + this._offset()) % 360

    return Color.fromHSL(newH,s,l)
  }
  _offset() { return 120 }
}

class Triad2 extends Triad1 {
  _offset() { return 240 }
}

const algorithms = {
  analogous1: Analogous1,
  analogous2: Analogous2,
  complement: Complement,
  splitComplement1: SplitComplement1,
  splitComplement2: SplitComplement2,
  triad1: Triad1,
  triad2: Triad2,
}

export default class ColorWheel {
  static algorithm(name) {
    if (name instanceof Algorithm) {
      return name
    }
    const klass = algorithms[name]
    if (!klass) {
      throw `No such ColorWheel algorithm named '${name}'`
    }
    return new klass
  }

  static algorithms = {
    analogous:       () => [ "analogous1","analogous2" ],
    complement:      () => [ "complement" ],
    splitComplement: () => [ "splitComplement1", "splitComplement2" ],
    triad:           () => [ "triad1", "triad2" ],
  }
}
