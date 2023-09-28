import { Component, EventManager } from "brutaldom"

import ArrayShuffler from "../../../ArrayShuffler"
import Color         from "../../../Color"
import Demonstration from "../Demonstration"
import Exploration   from "../Exploration"
import Reflection    from "../Reflection"
import Debug         from "./Debug"
import Help          from "./Help"

class ExercisePhase {
  constructor() {
    this.phase = "not_started"
  }

  start() {
    if ( (this.phase == "not_started") || (this.phase == "complete") ) {
      this.phase = "explore"
    }
    else {
      throw `In progress`
    }
  }

  next() {
    if (this.phase == "not_started") {
      throw "Not started"
    }
    else if (this.phase == "explore") {
      this.phase = "reflect"
    }
    else if (this.phase == "reflect") {
      this.phase = "complete"
    }
  }
  isExplore()  { return this.phase == "explore" }
  isReflect()  { return this.phase == "reflect" }
  inProgress() { return this.isReflect() || this.isExplore() }
  toString()   { return this.phase }
}

class Background extends Component {
  set color(val) {
    this.element.style.backgroundColor  = val.hex()
  }
}

class Rectangles {
  constructor(elements) {
    this.elements = elements
  }
  set color(val) {
    this.elements.forEach( (element) => element.style.backgroundColor = val.hex() )
  }

}

export default class Exercise extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"complete")

    this.help       = new Help(this.$("help"))
    this.debug      = new Debug(this.$("debug"))
    this.left       = new Background(this.$("left"))
    this.right      = new Background(this.$("right"))
    this.rectangles = new Rectangles(this.$selectors("[data-rectangle]"))

    this.help.onGo( () => {
      this.help.hide()
      this.help.hideGoButton()
      this.help.showContinueButton()
      this.begin()
    })
    this.help.onContinue( () => this.help.hide() )

    this.element.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.help.show()
      }
      else {
        this.help.hide()
        this.hide()
      }
    })

    this.phase = new ExercisePhase()
    this.debug.phase = this.phase
  }

  begin() {
    this.phase.start()
    this.exploration = []
    this.demonstrations = Demonstration.knownDifferent().concat(
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
      Demonstration.random(),
    )
    this.index = -1
    this.cycle()
  }
  
  startup() {
    this.show()
    return this.element.requestFullscreen({
      navigationUI: "hide",
    })
  }

  shutdown() {
    document.exitFullscreen().then( () => this.hide() )
  }


  set demonstration(val) {
    this.left.color = val.left
    this.right.color = val.right
    this.rectangles.color = val.color
  }

  cycle() {
    this.index += 1
    if (this.demonstrations[this.index]) {
      this.debug.index = this.index
      this.debug.length = this.demonstrations.length
      this.demonstration = this.demonstrations[this.index]
    }
    else if (this.phase.isExplore()) {
      // Move to the reflection phase

      // Demonstrations where the foreground looked the same
      let same       = this.exploration.filter( (x) => x.rating == "same" )

      // Demonstrations where the foreground looked different
      let different  = this.exploration.filter( (x) => x.rating == "different" )

      // We know want to try to disambiguate situations where the foreground is influencable
      // from situations where the background did the influencing
      //
      // This means pairing the differents with the sames
      same      = ArrayShuffler.shuffle(same)
      different = ArrayShuffler.shuffle(different)

      this.demonstrations = same.map( (analysisWhereSame,index) => {
        const analysisWhereDifferent = different[index]
        if (analysisWhereDifferent) {
          return [
            new Demonstration({
              color: analysisWhereSame.demonstration.color,
              left: analysisWhereDifferent.demonstration.left,
              right: analysisWhereDifferent.demonstration.right,
              type: "color-same",
            }),
            new Demonstration({
              color: analysisWhereDifferent.demonstration.color,
              left: analysisWhereSame.demonstration.left,
              right: analysisWhereSame.demonstration.right,
              type: "color-different",
            })
          ]
        }
        else {
          const left = Color.random(analysisWhereSame.demonstration.color)
          const right = Color.random(analysisWhereSame.demonstration.color,left)
          return [
            new Demonstration({
              color: analysisWhereSame.demonstration.color,
              left: left,
              right: right,
              type: "color-sam",
            })
          ]
        }
      }).filter( (x) => !!x ).flat()

      this.phase.next()
      this.index = -1
      this.reflections = []
      this.cycle()
      window.demonstrations = this.demonstrations
      window.reflections = this.reflections
    }
    else if (this.phase.isReflect()) {
      this.phase.next()
      this.shutdown()
      this.completeEventManager.fireEvent(this.reflections)
    }
    else {
      throw `WTF, no such phase ${this.phase}`
    }
  }

  _save(rating) {
    const demonstration = this.demonstrations[this.index]
    if (this.phase.isExplore()) {
      this.exploration.push(
        new Exploration(demonstration,rating)
      )
    }
    else if (this.phase.isReflect()) {
      this.reflections.push(
        new Reflection(demonstration,rating)
      )
    }
    else {
      return 
    }
  }

  saveDifferent() {
    if (!this.phase.inProgress()) { return }
    this._save("different")
    this.cycle()
  }
  saveNotDifferent() {
    if (!this.phase.inProgress()) { return }
    this._save("same")
    this.cycle()
  }

  toggleDebug() { this.debug.toggle() }
  showHelp() { this.help.show() }
}
