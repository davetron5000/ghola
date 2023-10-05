import { Component, EventManager, Link } from "brutaldom"

import Swatch from "../../../components/Swatch"

export default class Results extends Component {
  wasCreated(swatchTemplate) {
    EventManager.defineEvents(this,"again","harder","summary")

    this.swatchTemplate = swatchTemplate

    this.$percentSlots = this.$slots("percent")
    this.$darkGroup    = this.$("dark")
    this.$lightGroup   = this.$("light")
    this.heading       = this.$selector("h3")

    this.goAgain  = new Link(this.$("go-again"))
    this.goHarder = new Link(this.$("go-harder"))
    this.summary = new Link(this.$("show-summary"))

    this.goAgain.onClick(this.againEventManager)
    this.goHarder.onClick(this.harderEventManager)
    this.summary.onClick(this.summaryEventManager)
  }

  show(answers) {
    super.show()

    const numCorrect = answers.filter( (answer) => answer.isCorrect() ).length
    const percentCorrect = Math.floor(numCorrect / answers.length * 100)

    this.$percentSlots.forEach( (slot) => slot.textContent = percentCorrect )

    this.$darkGroup.innerHTML = ""
    this.$lightGroup.innerHTML = ""

    answers.forEach( (answer) => {
      const node = this.swatchTemplate.newNode()
      const swatch = new Swatch(node,answer.color,[])

      swatch.size = "large"
      swatch.hideContrast()
      swatch.hex.element.textContent = isNaN(answer.hsl()[0]) ? answer.hex() : `HSL(${answer.hsl().join(",")})`

      if (answer.isCorrect()) {
        swatch.name.element.innerHTML = "&check;"
      }
      else {
        swatch.name.element.innerHTML = "&times; wrong :("
        swatch.element.style.backgroundColor = "#000";
        swatch.element.style.color = "#fff";
      }

      if (answer.correctAnswer.isDark()) {
        this.$darkGroup.appendChild(node)
      }
      else {
        this.$lightGroup.appendChild(node)
      }
    })
    this._scrollIntoView()
  }

  showSummaryLink() {
    this.summary.show()
    this.goHarder.hide()
  }

  _scrollIntoView() {
    setTimeout( () => ( this.heading.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }) ), 500)
  }
}
