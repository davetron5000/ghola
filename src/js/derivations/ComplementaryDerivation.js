import chroma from "chroma-js"
import BaseDerivation from "./BaseDerivation"

export default class ComplementaryDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = chroma(hexCode).hsl()
    const newH = (h + 180) % 360
    return chroma.hsl(newH,s,l).hex()
  }
}
