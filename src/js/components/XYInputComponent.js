import BaseCustomElement          from "../brutaldom/BaseCustomElement"

export default class XYInputComponent extends BaseCustomElement {

  static tagName = "g-xy-input"
  static observedAttributes = [
    "x",
    "y",

    "x-min",
    "x-max",
    "y-min",
    "y-max",

    "show-warnings",
  ]

  _positionCursor(x,y) {
    if (this.xValue && this.yValue) {

      const width  = this._intOrDefault(this.cursor.offsetWidth)
      const height = this._intOrDefault(this.cursor.offsetHeight)

      this.cursor.style.top = (y - (width / 2)) + "px"
      this.cursor.style.left = (x - (height / 2)) + "px"
    }
  }
  
  constructor() {
    super()
    this.mouseDown = false
    this.mouseDownListener = (event) => {
      if (event.button == 0) {
        this.cursorStyle = this.style.cursor || "auto"
        this.style.cursor = "crosshair"
        this.mouseDown = true
        if (this.cursor) {
          this._positionCursor(event.offsetX,event.offsetY)
        }
      }

    }
    this.mouseUpListener = (event) =>  {
      this.style.cursor = this.cursorStyle
      if (event.button == 0) {
        this.mouseDown = false
      }
    }

    this.mouseLeaveListener = (event) => {
      this.style.cursor = this.cursorStyle
      this.mouseDown = false
    }

    this.mouseMoveListener = (event) => {
      if (this.mouseDown) {
        if (this.cursor) {
          this._positionCursor(event.offsetX,event.offsetY)
        }
        const width  = event.target.offsetWidth
        const height = event.target.offsetHeight

        const percentOfWidth  = event.offsetX / width
        const percentOfHeight = event.offsetY / height

        const scaledX = percentOfWidth * this.numXValues
        const scaledY = percentOfHeight * this.numYValues

        this.xValue = Math.floor( (scaledX + this.xMin) )
        this.yValue = Math.floor( (scaledY + this.yMin) )

        this.querySelectorAll("[data-x-value").forEach( (element) => element.textContent = this.xValue )
        this.querySelectorAll("[data-y-value").forEach( (element) => element.textContent = this.yValue )

        this.offsetXInputs.forEach( (element) => {
          element.value = this.xValue 
          element.dispatchEvent(new InputEvent("input",{ bubbles: true, cancelable: true }))
        })
        this.offsetYInputs.forEach( (element) => {
          element.value = this.yValue 
          element.dispatchEvent(new InputEvent("input",{ bubbles: true, cancelable: true }))
        })
      }
    }
    this.xChangedListener = (event) => {
      this.xValue = event.target.value
      this.render()
    }
    this.yChangedListener = (event) => {
      this.yValue = event.target.value
      this.render()
    }
  }

  xChangedCallback({newValue}) { this.xValue = newValue }
  yChangedCallback({newValue}) { this.yValue = newValue }

  xMinChangedCallback({newValue}) { this.xMin = this._intOrDefault(newValue) }
  xMaxChangedCallback({newValue}) { this.xMax = this._intOrDefault(newValue) }
  yMinChangedCallback({newValue}) { this.yMin = this._intOrDefault(newValue) }
  yMaxChangedCallback({newValue}) { this.yMax = this._intOrDefault(newValue) }
  
  render() {
    const xyControl = document.querySelector("[data-xy]")
    if (!xyControl) {
      this.logger.warn("Could not find anything with [data-xy]")
      return
    }
    this.cursor = document.querySelector("[data-cursor]")
    if (!this.cursor) {
      this.logger.warn("Could not find [data-cursor]")
      return
    }

    this.querySelectorAll("[data-x-min]").forEach( (e) => e.textContent = this.xMin )
    this.querySelectorAll("[data-x-max]").forEach( (e) => e.textContent = this.xMax )
    this.querySelectorAll("[data-y-min]").forEach( (e) => e.textContent = this.yMin )
    this.querySelectorAll("[data-y-max]").forEach( (e) => e.textContent = this.yMax )

    if (
      this._requireIntValue("xMin") &&
      this._requireIntValue("xMax") &&
      this._requireIntValue("yMin") &&
      this._requireIntValue("yMax")
    ) {

      const x = this.xValue || 0
      const y = this.yValue || 0

      const cursorX = xyControl.offsetWidth  * ((x - this.xMin) / this.numXValues) 
      const cursorY = xyControl.offsetHeight * ((y - this.yMin) / this.numYValues) 
      this._positionCursor(cursorX,cursorY)
      this.querySelectorAll("[data-x-value").forEach( (element) => element.textContent = this.xValue )
      this.querySelectorAll("[data-y-value").forEach( (element) => element.textContent = this.yValue )

      xyControl.addEventListener("mousedown", this.mouseDownListener)
      xyControl.addEventListener("mouseup", this.mouseUpListener)
      xyControl.addEventListener("mousemove", this.mouseMoveListener)
      xyControl.addEventListener("mouseleave", this.mouseLeaveListener)

      this.offsetXInputs.forEach( (element) => {
        element.addEventListener("input",this.xChangedListener) 
        element.setAttribute("min",this.xMin)
        element.setAttribute("max",this.xMax)
      })

      this.offsetYInputs.forEach( (element) => {
        element.addEventListener("input",this.yChangedListener) 
        element.setAttribute("min",this.yMin)
        element.setAttribute("max",this.yMax)
      })

    }
    else {
      xyControl.removeEventListener("mousedown", this.mouseDownListener)
      xyControl.removeEventListener("mouseup", this.mouseUpListener)
      xyControl.removeEventListener("mousemove", this.mouseMoveListener)
      xyControl.removeEventListener("mousemove", this.mouseLeaveListener)
    }
  }

  get numXValues() { return this.xMax - this.xMin }
  get numYValues() { return this.yMax - this.yMin }

  get offsetXInputs() { return this.querySelectorAll("input[name='offset-x']") }
  get offsetYInputs() { return this.querySelectorAll("input[name='offset-y']") }

  _requireIntValue(attribute) {
    if (this[attribute] || this[attribute] == 0) {
      return true
    }
    else {
      if (this.isConnected) {
        this.logger.warn(`${attribute} has no value, so the control can't work`)
      }
      return false
    }
  }

  _intOrDefault(value,defaultValue=0) {
    if (!value && value !== 0) {
      return defaultValue
    }
    const parsed = parseInt(value)
    if (isNaN(parsed)) {
      this.logger.warn(`Value '${value}' was not a number. Using '${defaultValue}' instead`)
      return defaultValue
    }
    return parsed
  }


}
