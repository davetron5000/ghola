import { Component, EventManager, Link, Body } from "brutaldom"

import Swatch from "../../../components/Swatch"

class SwatchSummary extends Component {
  wasCreated(h,s,l) {
    this.$slot("h").textContent = h
    this.$slot("s").textContent = s
    this.$slot("l").textContent = l
    this.$("h").style.backgroundColor = `hsl(${h}  100%   50%)`
    this.$("s").style.backgroundColor = `hsl(${h} ${s}%   50%)`
    this.$("l").style.backgroundColor = `hsl(0       0% ${l}%)`
  }
}

export default class Summary extends Component {
  wasCreated(swatchTemplate) {
    this.$percentSlots   = this.$slots("percent")
    this.$correct        = this.$("correct")
    this.$incorrect      = this.$("incorrect")
    this.summaryTemplate = this.template("swatch-summary")
    this.swatchTemplate  = swatchTemplate
    this.heading         = this.$selector("h3")
    this.done            = new Link(this.$("done"))
  }

  show(answers) {
    super.show()

    const correct = answers.filter( (answer) => answer.isCorrect() )
    const incorrect = answers.filter( (answer) => !answer.isCorrect() )

    const percentCorrect = Math.floor(correct.length / answers.length * 100)
    this.$percentSlots.forEach( (slot) => slot.textContent = percentCorrect )


    answers.forEach( (answer) => {
      const node = this.swatchTemplate.newNode()
      const swatch = new Swatch(node,answer.color,[])

      swatch.size = "small"
      swatch.hideContrast()
      const [h,s,l] = answer.hsl()
      if (isNaN(h)) {
        swatch.hex.element.textContent = answer.hex()
      }
      else {
        swatch.hex.element.innerHTML = ""
        const summaryNode = this.summaryTemplate.newNode()
        swatch.hex.element.appendChild(summaryNode)
        new SwatchSummary(summaryNode,h,s,l)
      }

      if (answer.isCorrect()) {
        this.$correct.appendChild(node)
      }
      else {
        this.$incorrect.appendChild(node)
      }
    })
    this._scrollIntoView()
  }
  _scrollIntoView() {
    setTimeout( () => ( this.heading.scrollIntoView() ), 50)
  }
}
