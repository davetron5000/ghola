import chroma from "chroma-js"

import Color          from "../Color"
import ColorScaleBase from "./ColorScaleBase"

export default class ChromaScale extends ColorScaleBase {
  constructor(color, numShades) {
    super(color, numShades)
    const scale = chroma.scale(["black", color.hex(), "white"])
    this.shades = scale.colors(numShades + 2).slice(1,numShades+1).map( (chromaColor) => {
      return new Color(chromaColor)
    })
  }
}
