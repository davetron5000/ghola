/*
 * TODO:
 *
 * - allow choosing more than one color
 * - better choices for dark/light
 * - take chosen color and categorize it as level, then build around it
 * - category names for colors
 * - debounce events
 */

import { Body, Component, EventManager } from "brutaljs"

import PageState from "./components/PageState"
import Form from "./components/Form"
import Palette from "./components/Palette"

document.addEventListener("DOMContentLoaded", () => {
  const pageState = new PageState(window,{
    numColors: 6,
    colorHex: "#8900C0",
    numShades: 5,
  })

  const body = new Body()

  const paletteGenerator = new Palette(body.$("palette"))
  const form = new Form(body.$selector("form"),{
    numColors: pageState.numColors,
    color: pageState.color,
    numShades: pageState.numShades,
  })

  form.onBaseColorChanged( (color)     => paletteGenerator.rebuild({baseColor: color}) )
  form.onNumColorsChanged( (numColors) => paletteGenerator.rebuild({numColors}) )
  form.onNumShadesChanged( (numShades) => paletteGenerator.rebuild({numShades}) )

  form.onBaseColorChanged( (color)     => pageState.color = color ) 
  form.onNumColorsChanged( (numColors) => pageState.numColors = numColors )
  form.onNumShadesChanged( (numShades) => pageState.numShades = numShades )

  pageState.onPopstate( ({numColors,color,numShades}) => {
    paletteGenerator.rebuild({
      numColors: numColors,
      baseColor: color,
      numShades: numShades,
    })
  })

  pageState.onPopstate( ({numColors,color,numShades}) => {
    form.numColors = numColors
    form.color = color
    form.numShades =  numShades
  })

  paletteGenerator.rebuild({
    numColors: form.numColors,
    baseColor: form.color,
    numShades: form.numShades,
  })

})
