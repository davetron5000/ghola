import BaseDerivation from "./BaseDerivation"

class AnalogousUpperDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = this.hsl(hexCode)
    const newH = (h + 330)  % 360

    return this.hexCode(newH,s,l)
  }
  get humanName() { return "Analogous" }
}

class AnalogousLowerDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = this.hsl(hexCode)
    const newH = (h + 30)  % 360

    return this.hexCode(newH,s,l)
  }
  get humanName() { return "Analogous" }
}
export {
  AnalogousLowerDerivation,
  AnalogousUpperDerivation,
}
