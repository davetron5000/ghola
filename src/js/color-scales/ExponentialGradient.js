import BaseGradient from "./BaseGradient"

export default class ExponentialGradient extends BaseGradient {
  valueFor(index,numSwatches) {
    const middle = (numSwatches - 1) / 2
    const step = index + 1
    const adjustedMiddle = middle + 1
    const adjustedStep = step - adjustedMiddle
    const percentAlongRange = adjustedStep / adjustedMiddle
    
    const percentage = this._quarticBabyYeah(percentAlongRange)

    if (index < middle) {
      return [ "darken-by", -1 * percentage ]
    }
    else {
      return [ "brighten-by", percentage ]
    }
  }

  _quarticBabyYeah(x) {
    /*
     * https://mycurvefit.com
       -0.75               -90        
       -0.5                -60        
       -0.25               -40        
        0                    0        
        0.25                60        
        0.5                 80        
        0.75                98
    const a =    4.0692
    const b =  175.3016
    const c =   51.8788
    const d =  -92.4444
    const e =  -93.0909
    */

    let a =    7.990513
    let b = 173.3344
    let c = -3.832653
    let d = -88.37532
    let e = 0
    return  a                  +
           (b * x)             +
           (c * Math.pow(x,2)) +
           (d * Math.pow(x,3)) +
           (e * Math.pow(x,4))
  }

}
