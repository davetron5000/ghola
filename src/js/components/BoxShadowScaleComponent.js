import BaseCustomElement from "../brutaldom/BaseCustomElement"

export default class BoxShadowScaleComponent extends BaseCustomElement {

  static tagName = "g-box-shadow-scale"

  static observedAttributes = [
    "offset-x",
    "offset-y",
    "blur-radius",
    "spread-radius",
    "inset",
    "color",

    "gradient",

    "border-radius",
    "border-color",
    "background-color",

    "form",

    "show-warnings",
  ]

  formChangedCallback({newValue}) {
    this.formId = newValue
  }

  gradientChangedCallback({newValue}) {
    this.gradient = (100 + this._requireRawNumber(newValue)) / 100
  }

  borderRadiusChangedCallback({newValue}) {
    this.borderRadius = 100 * Math.pow(this._requireRawNumber(newValue) / 100, 3)
  }

  borderColorChangedCallback({newValue}) {
    let gray = this._requireRawNumber(newValue,256)
    if (gray == 0) {
      this.borderColor = "transparent"
    }
    else {
      gray = 256 * Math.pow(this._requireRawNumber(gray) / 256, 3)
      gray = 256 - gray
      this.borderColor = `rgb(${gray},${gray},${gray})`
    }
  }
  backgroundColorChangedCallback({newValue}) {
    let gray = this._requireRawNumber(newValue,256)
    if (gray == 0) {
      this.backgroundColor = "transparent"
    }
    else {
      gray = 256 * Math.pow(this._requireRawNumber(gray) / 256, 3)
      gray = 256 - gray
      this.backgroundColor = `rgb(${gray},${gray},${gray})`
    }
  }

  offsetXChangedCallback({newValue}) {
    this.offsetX = this._requireRawNumber(newValue)
  }

  offsetYChangedCallback({newValue}) {
    this.offsetY = this._requireRawNumber(newValue)
  }

  blurRadiusChangedCallback({newValue}) {
    this.blurRadius = this._requireRawNumber(newValue)
  }

  spreadRadiusChangedCallback({newValue}) {
    this.spreadRadius = this._requireRawNumber(newValue)
  }

  colorChangedCallback({newValue}) {
    this.color = newValue
  }

  insetChangedCallback({newValue}) {
    this.inset = newValue || newValue == ""
  }

  constructor() {
    super()
    this.spreadRadius = 0
    this.blurRadius = 0
    this.offsetY = 0
    this.offsetX = 0
    this.color = "black"
    this.borderRadius = 0
    this.changeListener = (event) => {
      if (event.detail && event.detail.target) {
        if (event.detail.target.type == "checkbox") {
          if (event.detail.target.checked) {
            this.setAttribute(event.detail.target.name,true)
          }
          else {
            this.removeAttribute(event.detail.target.name)
          }
        }
        else {
          this.setAttribute(event.detail.target.name,event.detail.target.value)
        }
      }
    }
  }

  render() {
    const form = document.getElementById(this.formId)
    if (form) {
      form.linkElements(this.changeListener)
    }


    const boxShadows = this.querySelectorAll("g-box-shadow")
    if (boxShadows.length == 0) {
      this.logger.warn("No g-box-shadow elements inside - can't do anything")
      return
    }
    const primaryBoxShadow = boxShadows[0]
    primaryBoxShadow.setAttribute("color",this.color)
    primaryBoxShadow.setAttribute("blur-radius",this.blurRadius)
    primaryBoxShadow.setAttribute("spread-radius",this.spreadRadius)
    primaryBoxShadow.setAttribute("offset-x",this.offsetX)
    primaryBoxShadow.setAttribute("offset-y",this.offsetY)
    if (this.inset) {
      primaryBoxShadow.setAttribute("inset",true)
    }
    else {
      primaryBoxShadow.removeAttribute("inset")
    }

    const css = []

    boxShadows.forEach( (element, index) => {
      if (element.children[0]) {
        element.children[0].style.borderRadius = `${this.borderRadius}%`
        element.children[0].style.borderColor = this.borderColor
        element.children[0].style.borderStyle = "solid"
        element.children[0].style.borderWidth = "1px"
        element.children[0].style.backgroundColor = this.backgroundColor
      }
      if (this.gradient) {
        let raiseBy = 1 + Math.pow(this.gradient,index)
        if (index > 0) {
          element.setAttribute("raise-by",raiseBy)
        }
      }
      else {
        element.removeAttribute("raise-by")
      }
      if (element.children[0]) {
        css.push(`.${this.inset ? 'inset-' : ''}shadow-${index + 1} {\n  box-shadow: ${element.children[0].style.boxShadow}\n}\n`)
      }
    })

    if (this.querySelector("code"))  {
      this.querySelector("code").textContent = css.join("\n")
    }
  }

  _requireRawNumber(value,defaultValue=0) {
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue)) {
      this.logger.warn(`Value '${value}' is not a number and will be ignored`)
      return defaultValue
    }
    return parsedValue
  }
}
