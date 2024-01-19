import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class PreviewTextComponent extends BaseCustomElement {

  static tagName = "g-preview-text"
  static observedAttributes = [
    "background-color",
    "text-color",
    "show-warnings",
  ]

  constructor() {
    super()
    this.fullscreenListener = (event) => {
      event.preventDefault()
      this.requestFullscreen().then( () => {
        this.querySelectorAll("button[data-exit-full-screen]").forEach( (element) => {
          element.style.display = "inline"
        })
        this.querySelectorAll("button[data-full-screen]").forEach( (element) => {
          element.style.display = "none"
        })
      }).catch( (e) => {
        console.warn("Full screen rejected: %o",e)
      })
    }
    this.exitFullscreenListener = (event) => {
      event.preventDefault()
      document.exitFullscreen().then( () => {
        this.querySelectorAll("button[data-exit-full-screen]").forEach( (element) => {
          element.style.display = "none"
        })
        this.querySelectorAll("button[data-full-screen]").forEach( (element) => {
          element.style.display = "inline"
        })
      }).catch( (e) => {
        console.warn("Exit Full screen rejected: %o",e)
      })
    }
  }

  backgroundColorChangedCallback({newValue}) {
    this.backgroundColor = newValue
  }

  textColorChangedCallback({newValue}) {
    this.textColor = newValue
  }

  render() {
    if (this.backgroundColor) {
      this.style.backgroundColor = this.backgroundColor
    }
    else {
      this.style.backgroundColor = "transparent"
    }
    if (this.textColor) {
      this.style.color = this.textColor
    }
    else {
      this.style.color = "currentColor"
    }
    this.querySelectorAll("button[data-exit-full-screen]").forEach( (element) => {
      element.addEventListener("click", this.exitFullscreenListener)
      element.style.display = "none"
    })
    this.querySelectorAll("button[data-full-screen]").forEach( (element) => {
      element.addEventListener("click", this.fullscreenListener)
      element.style.display = "inline"
    })
  }
}
