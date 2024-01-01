import NumericRange from "./NumericRange"
import Color from "./Color"

export default class ColorCategory {
  static broadColorMap = [
    [ "red"    , new NumericRange(0   , 21) ]  ,
    [ "orange" , new NumericRange(21  , 41) ]  ,
    [ "yellow" , new NumericRange(41  , 74) ]  ,
    [ "green"  , new NumericRange(74  , 167) ] ,
    [ "blue"   , new NumericRange(167 , 259) ] ,
    [ "purple" , new NumericRange(259 , 333) ] ,
    [ "red2"   , new NumericRange(333 , 360) ] ,
  ]
  static narrowColorMap = [
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
      this.broad = "gray"
      this.narrow = "gray"
    }
    else {
      const [broadName,_range] = this.constructor.broadColorMap.find( ( [_name,range] ) => {
        return range.isWithin(hue)
      })
      if (broadName == "red2") {
        this.broad = "red"
      }
      else {
        this.broad = broadName
      }
      const [narrowName,_range2] = this.constructor.narrowColorMap.find( ( [_name,range] ) => {
        return range.isWithin(hue)
      })
      if (narrowName == "red2") {
        this.narrow = "red"
      }
      else {
        this.narrow = narrowName
      }
      if (!this.broad) { throw `WTF: Hue ${hue} had no broad value?!` }
      if (!this.narrow) { throw `WTF: Hue ${hue} had no narrow value?!` }

    }
  }
}
