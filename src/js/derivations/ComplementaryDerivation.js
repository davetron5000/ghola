import BaseDerivation from "./BaseDerivation"

export default class ComplementaryDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = this.hsl(hexCode)
    const newH = (h + 180) % 360
    return this.hexCode(newH,s,l)
  }
}
