import { Body, Link, Template } from "brutaldom"
import Exercise from "./components/Exercise"

document.addEventListener("DOMContentLoaded", () => {
  const body  = new Body()

  const start    = new Link(body.$("start"))
  const exercise = new Exercise(body.$("exercise"), new Template(body.$selector("template[data-swatch]")))

  start.onClick( () => exercise.startup() )
  start.onClick( () => start.hide() )

  exercise.onAbandoned( () => start.show() )
  exercise.onDone( () => start.show() )
})
