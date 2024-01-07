import chroma from "chroma-js"
import BaseDerivation from "./BaseDerivation"

class AnalogousUpperDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = chroma(hexCode).hsl()
    const newH = (h + 330)  % 360

    return chroma.hsl(newH,s,l)
  }
}

class AnalogousLowerDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = chroma(hexCode).hsl()
    const newH = (h + 30)  % 360

    return chroma.hsl(newH,s,l)
  }
}
export {
  AnalogousLowerDerivation,
  AnalogousUpperDerivation,
}
