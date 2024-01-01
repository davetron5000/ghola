import chroma from "chroma-js"

import Color from "../dataTypes/Color"

export default class ColorScale {
  constructor({baseColor,numSteps}) {
    if (numSteps % 2 == 0) {
      throw `numSteps must be odd`
    }
    if (numSteps < 3) {
      throw `numSteps must be at least 3`
    }

    this.baseColor = baseColor
    this.numSteps  = numSteps
    this.scale     = this._calculateScale()
  }

  map(f)       { return this.scale.map(f) }
  color(index) { return this.scale[index] }
  get length() { return this.scale.length }
  forEach(f)   { return this.scale.forEach(f) }
  reverse()    { return this.scale.reverse() }

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
    const numColorsToGenerate = this.numSteps * 10
    const colors = chroma.scale(["black",this.baseColor.toString(),"white"]).
      colors(numColorsToGenerate + 2).
      map( (color) => new Color(color) ).
      slice(1,numColorsToGenerate + 1)

    const selectedColors = []
    const halfway = (this.numSteps-1) / 2
    for (let i = 0; i < this.numSteps; i++) {
      if (i == halfway) {
        selectedColors[halfway] = this.baseColor
      }
      else {
        selectedColors[i] = colors[Math.floor(colors.length * this._percentForIndex(i,this.numSteps-1))]
      }
    }

    return selectedColors
  }
}
