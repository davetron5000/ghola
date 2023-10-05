import { Body, Link, Template } from "brutaldom"
import ColorExercise from "./components/ColorExercise"
import GrayExercise  from "./components/GrayExercise"

document.addEventListener("DOMContentLoaded", () => {
  const body  = new Body()

  const startColor     = new Link(body.$("start"))
  const startGray      = new Link(body.$("start-gray"))
  const swatchTemplate = new Template(body.$selector("template[data-swatch]"))
  const colorExercise  = new ColorExercise(body.$("exercise"), swatchTemplate)
  const grayExercise   = new GrayExercise(body.$("gray-exercise"), swatchTemplate)

  startColor.onClick( () => colorExercise.startup() )
  startColor.onClick( () => startColor.hide() )
  startColor.onClick( () => startGray.hide() )

  startGray.onClick( () => grayExercise.startup() )
  startGray.onClick( () => startColor.hide() )
  startGray.onClick( () => startGray.hide() )

  colorExercise.onAbandoned( () => startColor.show() )
  colorExercise.onAbandoned( () => startGray.show() )

  colorExercise.onDone( () => startColor.show() )
  colorExercise.onDone( () => startGray.show() )

  grayExercise.onAbandoned( () => startColor.show() )
  grayExercise.onAbandoned( () => startGray.show() )

  grayExercise.onDone( () => startColor.show() )
  grayExercise.onDone( () => startGray.show() )
})
