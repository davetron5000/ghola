import chroma from "chroma-js"
import LinearDerivation from "./LinearDerivation"

class ColorScale {
  constructor({baseHexCode,numSteps}) {
    if (numSteps % 2 == 0) {
      throw `numSteps must be odd`
    }
    if (numSteps < 3) {
      throw `numSteps must be at least 3`
    }

    this.baseHexCode = baseHexCode
    this.numSteps    = numSteps
    this.scale       = this._calculateScale()
  }

  color(index) { return this.scale[index] }

  _percentForIndex(index,largestIndex) {
    // I hand-crafted a set of values for 7 steps, then had
    // Wolfram Alpha fit a cubic function to the values, so this should
    // in theory work on a scale of any size
    const a = -1.8
    const b =  2.7
    const c =  0.0928572
    const d =  0.00357143

    const x = index/largestIndex

    return ( Math.pow(x,3) * a ) + 
      ( Math.pow(x,2) * b ) + 
      (          x    * c ) +
      d
  }


  _calculateScale() {
    const numColorsToGenerate = this.numSteps < 20 ? (this.numSteps * 10) : this.numSteps
    const scale = chroma.scale(["black",this.baseHexCode,"white"])
    const chromaColors = scale.colors(numColorsToGenerate + 2)
    const colors = chromaColors.slice(1,numColorsToGenerate + 1)

    const selectedColors = []
    const halfway = (this.numSteps-1) / 2
    for (let i = 0; i < this.numSteps; i++) {
      if (i == halfway) {
        selectedColors[halfway] = this.baseHexCode
      }
      else {
        selectedColors[i] = colors[Math.floor(colors.length * this._percentForIndex(i,this.numSteps-1))]
      }
    }
    return selectedColors
  }
}

export default class ExponentialDerivation extends LinearDerivation {
  darken(hexCode,darken) {
    const index = 50 - Math.floor(darken / 2)
    const scale = new ColorScale({baseHexCode: hexCode, numSteps: 101})
    return scale.color(index)
  }

  brighten(hexCode,brighten) {
    const index = 50 + Math.floor(brighten / 2)
    const scale = new ColorScale({baseHexCode: hexCode, numSteps: 101})
    return scale.color(index)
  }

}
