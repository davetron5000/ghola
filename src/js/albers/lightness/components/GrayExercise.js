import ArrayShuffler from "../../../ArrayShuffler"
import Color         from "../../../Color"
import ColorExercise from "./ColorExercise"
import NumericRange  from "../../../NumericRange"

export default class GrayExercise extends ColorExercise {
  _phases() {
    return [
      {
        total: 6,
        dark: new NumericRange(125,128),
        light: new NumericRange(128,131),
      },
      {
        total: 2,
        dark: new NumericRange(127,128),
        light: new NumericRange(128,129),
      },
      {
        total: 2,
        dark: new NumericRange(27,28),
        light: new NumericRange(28,29),
      },
      {
        total: 2,
        dark: new NumericRange(200,201),
        light: new NumericRange(201,202),
      },
      {
        total: 6,
        dark: new NumericRange(34,39),
        light: new NumericRange(39,43),
      },
    ]
  }

  _randomColors({total,dark,light}) {

    const half = Math.ceil(total / 2)
    if (dark.size < half)  { throw `Dark range ${dark } is not sufficient to generate ${half} grays` }
    if (light.size < half) { throw `Dark range ${light} is not sufficient to generate ${half} grays` }

    const darks  = dark.map( (value) => {
      const hex = value < 9 ? `0${value.toString("16")}` : value.toString(16)
      return new Color(`#${hex}${hex}${hex}`) 
    })
    const lights = light.map( (value) => {
      const hex = value < 9 ? `0${value.toString("16")}` : value.toString(16)
      return new Color(`#${hex}${hex}${hex}`) 
    })

    return [
      ArrayShuffler.shuffle(darks).slice(0,half),
      ArrayShuffler.shuffle(lights).slice(0,half),
    ]
  }
}
