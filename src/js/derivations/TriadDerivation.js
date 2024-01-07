import chroma from "chroma-js"
import BaseDerivation from "./BaseDerivation"

class TriadUpperDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = chroma(hexCode).hsl()
    const newH = (h + 120)  % 360

    return chroma.hsl(newH,s,l)
  }
}

class TriadLowerDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = chroma(hexCode).hsl()
    const newH = (h + 240)  % 360

    return chroma.hsl(newH,s,l)
  }
}
export {
  TriadLowerDerivation,
  TriadUpperDerivation,
}
