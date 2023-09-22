import { Body, Link, Runtime } from "brutaldom"

import Exercise from "./components/Exercise"
import Results  from "./components/Results"

document.addEventListener("DOMContentLoaded", () => {

  const body        = new Body()
  const startButton = new Link(body.$("start"))
  const exercise    = new Exercise(body.$("exercise"))
  const results     = new Results(body.$("results"))

  startButton.onClick( () => exercise.startup() )
  startButton.onClick( () => startButton.hide() )
  exercise.onComplete( (reflections) => results.show(reflections) )

  if (Runtime.env().isDev()) {
    window.addEventListener("error", (e) => alert(e.message) )
  }

  document.addEventListener("keyup", (event) => {
    if (event.key == "?") {
      exercise.showHelp()
    }
    else if (event.key == "d") {
      exercise.saveDifferent()
    }
    else if (event.key == "s") {
      exercise.saveNotDifferent()
    }
    else if (event.key == "~") {
      exercise.toggleDebug()
    }
  })
})
