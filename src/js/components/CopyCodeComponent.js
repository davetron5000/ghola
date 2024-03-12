import BaseCustomElement from "../brutaldom/BaseCustomElement"
import Animator from "../brutaldom/Animator"

export default class CopyCodeComponent extends BaseCustomElement {

  static tagName = "g-copy-code"
  static observedAttributes = [
    "code",
    "show-warnings",
  ]

  codeChangedCallback({newValue}) {
    this.codeElementId = newValue
  }

  constructor() {
    super()
    this.clickListener = (event) => {
      event.preventDefault()
      const code = document.getElementById(this.codeElementId)
      if (!code) {
        this.logger.warn(`No element with id '${codeElementId}'`)
        return
      }
      const tmp = document.createElement("textarea")
      document.body.appendChild(tmp)

      tmp.value = code.textContent
      tmp.focus()
      tmp.select()

      document.execCommand("copy")
      document.body.removeChild(tmp)

      this.querySelectorAll("[data-copied-message]").forEach( (element) => {
        const animator = new Animator(element, {
          styles: {
            opacity: {
              from: "0",
              to: "100",
            }
          }
        })
        element.style.opacity = "0"
        element.style.display = "block"
        animator.animateForward(250).then( () => {
          setTimeout( () => {
            animator.animateBackward().then( () => {
              element.style.display = "none"
            })
          }, 1000)
        })
      })
    }
  }


  render() {
    const button = this.querySelector("button")
    if (!button) {
      this.logger.warn("Could not find a button, so can't do anything")
      return
    }

    button.addEventListener("click", this.clickListener)
  }

}
