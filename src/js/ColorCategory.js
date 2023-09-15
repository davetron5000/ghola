import NumericRange from "./NumericRange"

export default class ColorCategory {
  static sixColorMap = [
    [ "red"    , new NumericRange(0   , 21) ]  ,
    [ "orange" , new NumericRange(21  , 41) ]  ,
    [ "yellow" , new NumericRange(41  , 74) ]  ,
    [ "green"  , new NumericRange(74  , 167) ] ,
    [ "blue"   , new NumericRange(167 , 259) ] ,
    [ "purple" , new NumericRange(259 , 333) ] ,
    [ "red2"   , new NumericRange(333 , 360) ] ,
  ]
  static twelveColorMap = [
    [ "red"        , new NumericRange(0   ,  10) ] ,
    [ "vermilion"  , new NumericRange(10  ,  20) ]   ,
    [ "orange"     , new NumericRange(20  ,  33) ]   ,
    [ "gold"       , new NumericRange(33  ,  41) ]   ,
    [ "yellow"     , new NumericRange(41  ,  64) ]   ,
    [ "chartreuse" , new NumericRange(64  ,  89) ]   ,
    [ "green"      , new NumericRange(89  , 171) ]   ,
    [ "cyan"       , new NumericRange(171 , 192) ]   ,
    [ "blue"       , new NumericRange(192 , 258) ]   ,
    [ "purple"     , new NumericRange(258 , 282) ]   ,
    [ "magenta"    , new NumericRange(282  ,308) ]   ,
    [ "pink"       , new NumericRange(308  ,331) ]   ,
    [ "red2"       , new NumericRange(331  ,360) ]   ,
  ]

  constructor(color) {
    const hue = color.hue()
    if (isNaN(hue)) {
      this.six = "gray"
      this.twelve = "gray"
    }
    else {
      const [sixName,_range] = this.constructor.sixColorMap.find( ( [_name,range] ) => {
        return range.isWithin(hue)
      })
      if (sixName == "red2") {
        this.six = "red"
      }
      else {
        this.six = sixName
      }
      const [twelveName,_range2] = this.constructor.twelveColorMap.find( ( [_name,range] ) => {
        return range.isWithin(hue)
      })
      if (twelveName == "red2") {
        this.twelve = "red"
      }
      else {
        this.twelve = twelveName
      }
      if (!this.six) { throw `WTF: Hue ${hue} had no six value?!` }
      if (!this.twelve) { throw `WTF: Hue ${hue} had no twelve value?!` }

    }
  }
}
