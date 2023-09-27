import { Component, EventManager, Link, Body } from "brutaldom"

import Swatch from "../../../components/Swatch"

export default class Summary extends Component {
  wasCreated(swatchTemplate) {
    this.$percentSlots  = this.$slots("percent")
    this.$correct       = this.$("correct")
    this.$incorrect     = this.$("incorrect")
    this.swatchTemplate = swatchTemplate
    this.heading        = this.$selector("h3")
    this.done           = new Link(this.$("done"))
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
      swatch.hex.element.innerHTML = `
      <div class="flex items-baseline"><div class="ws-nowrap w-40 mt-1 mr-1">H:${h}</div><div class="w-60" style="background: hsl(${h} 100% 50%)">&nbsp;</div></div>
      <div class="flex items-baseline"><div class="ws-nowrap w-40 mr-1">S:${s}</div><div class="w-60" style="background: hsl(${h} ${s}% 50%)">&nbsp;</div></div>
      <div class="flex items-baseline"><div class="ws-nowrap w-40 mr-1">L:${l}</div><div class="w-60" style="background: hsl(0 0% ${l}%)">&nbsp;</div></div>`

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
