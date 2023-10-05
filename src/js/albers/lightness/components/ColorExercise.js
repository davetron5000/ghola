import { Component, EventManager } from "brutaldom"

import ArrayShuffler from "../../../ArrayShuffler"
import Color         from "../../../Color"
import NumericRange  from "../../../NumericRange"

import Answer        from "../Answer"
import LightnessType from "../LightnessType"

import ColorSwatch   from "./ColorSwatch"
import Grid          from "./Grid"
import Help          from "./Help"
import Results       from "./Results"
import Summary       from "./Summary"

export default class ColorExercise extends Component {
  _phases() {
    return [
      {
        total: 6,
        dark: new NumericRange(5,30),
        light: new NumericRange(70,95),
      },
      {
        total: 9,
        dark: new NumericRange(15,40),
        light: new NumericRange(60,85),
      },
      {
        total: 9,
        dark: new NumericRange(48,50),
        light: new NumericRange(51,53),
      },
      {
        total: 9,
        dark: new NumericRange(48,50),
        light: new NumericRange(51,53),
        sameHue: true,
      },
      {
        total: 2,
        dark: new NumericRange(49,50),
        light: new NumericRange(51,52),
      },
      {
        total: 2,
        dark: new NumericRange(49,50),
        light: new NumericRange(51,52),
        sameHue: true,
      },
      {
        total: 4,
        dark: new NumericRange(49,50),
        light: new NumericRange(51,52),
        sameHue: true,
      },
      {
        total: 6,
        dark: new NumericRange(49,50),
        light: new NumericRange(51,52),
        sameHue: true,
      },
    ]
  }

  wasCreated(swatchTemplate) {
    EventManager.defineEvents(this,"abandoned","done")

    this.colorTemplate = this.template("color")
    this.navTemplate   = this.template("nav")

    this.grid    = new Grid(this.$("grid"))
    this.help    = new Help(this.$("help"))
    this.results = new Results(this.$("results"), swatchTemplate)
    this.summary = new Summary(this.$("summary"), swatchTemplate)

    this.currentPhase = 0
    this.allColorsSeen = {}

    this.help.onGo( () => this.help.hide().then( () => this.start() ) )

    this.results.onAgain( () => this.results.hide() )
    this.results.onAgain( () => this.startup() )

    this.results.onHarder( () =>  this.results.hide() )
    this.results.onHarder( () => this._nextPhase() )

    this.results.onSummary( () => this.results.hide() )
    this.results.onSummary( () => this._showSummary() )

    this.element.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.help.show()
      }
      else {
        this._showResults()
      }
    })
  }

  startup() {
    this.show()
    return this.element.requestFullscreen({
      navigationUI: "hide",
    }).then( () => this.help.show() )
  }

  start() {
    console.log("start()")
    const totalSwatches = this._phases()[this.currentPhase].total
    const [
      darkColors,
      lightColors
    ] = this._randomColors(this._phases()[this.currentPhase])
    console.log("colors")
    console.log(darkColors)
    if (darkColors.length == 0) {
      console.error(this.currentPhase)
      console.error(this._phases())
      throw `WTF`
    }

    this.colors = {}
    darkColors.forEach( (color) => {
      this.colors[color.hex()] = {
        color: color,
        type: LightnessType.dark(),
      }
    })
    lightColors.forEach( (color) => {
      this.colors[color.hex()] = {
        color: color,
        type: LightnessType.light(),
      }
    })

    const shuffled = ArrayShuffler.shuffle(Object.values(this.colors).map( ({color}) => color ))
    const slough = Object.keys(this.colors).length - totalSwatches

    this.grid.clear()
    shuffled.forEach( (color, index) => {
      if (index >= slough)  {
        const node = this.colorTemplate.newNode()
        const isDarker = this.colors[color.hex()].type.isDark()
        const colorSwatch = new ColorSwatch(node,this.navTemplate,color,isDarker)
        colorSwatch.onSelected( (color,choice) => {
          this.colors[color.hex()].choice = choice
        })
        this.grid.addColorSwatch(colorSwatch)
      }
      else {
        delete this.colors[color.hex()]
      }
    })
    this.results.hide()
    this.grid.show()
  }

  _randomColors({total,dark,light,sameHue}) {
    if (!total || total < 2) {
      throw `${total} is not a valid total`
    }
    let darkColors = []
    let lightColors = []
    const half = Math.ceil(total / 2)
    for(let i=0;i<half;i++) {
      const color = Color.randomInHueRange(10,...darkColors).withLightness(dark.random(), { model: "hsl" })
      darkColors.push(color)
    }
    for(let i=0;i<half;i++) {
      const color = Color.randomInHueRange(10,...lightColors).withLightness(light.random(), { model: "hsl" })
      lightColors.push(color)
    }
    if (sameHue) {
      const hue = ArrayShuffler.shuffle(darkColors.concat(lightColors))[0].hue()

      darkColors  = darkColors.map( (color) => color.atHue(hue) )
      lightColors = lightColors.map( (color) => color.atHue(hue) )
    }
    return [
      darkColors,
      lightColors,
    ]
  }

  _nextPhase() {
    this.currentPhase += 1
    if (this.currentPhase < this._phases().length) {
      this.startup()
      if (this.currentPhase == (this._phases().length-1)) {
        this.results.showSummaryLink()
      }
    }
  }

  _showResults() {
    this.help.hide()
    this.grid.hide()
    if (!this.colors) {
      this.abandonedEventManager.fireEvent()
      return
    }
    this.allColorsSeen = { ...this.allColorsSeen,...this.colors }

    this.results.show(this._toAnswers(this.colors))
  }

  _toAnswers(colors) {
    return Object.entries(colors).map( ([ _hex, info ]) => {
      return new Answer({
        color: info.color,
        answer: info.choice,
        correctAnswer: info.type,
      })
    })
  }

  _showSummary() {
    this.grid.hide()
    this.help.hide()
    this.summary.show(this._toAnswers(this.allColorsSeen))
  }
}
