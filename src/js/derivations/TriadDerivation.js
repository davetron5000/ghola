import BaseDerivation from "./BaseDerivation"

class TriadUpperDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = this.hsl(hexCode)
    const newH = (h + 120)  % 360

    return this.hexCode(newH,s,l)
  }
  get humanName() { return "Triad" }
}

class TriadLowerDerivation extends BaseDerivation {
  derive(hexCode,options={}) {
    const [h,s,l] = this.hsl(hexCode)
    const newH = (h + 240)  % 360

    return this.hexCode(newH,s,l)
  }
  get humanName() { return "Triad" }
}
export {
  TriadLowerDerivation,
  TriadUpperDerivation,
}
