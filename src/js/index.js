/*
 * TODO:
 *
 * - save statue in query string/history
 * - allow choosing more than one color
 * - better choices for dark/light
 * - take chosen color and categorize it as level, then build around it
 * - category names for colors
 * - debounce events
 */

import { Body, Component, EventManager } from "brutaljs"
import { GetColorName } from "hex-color-to-color-name"
import chroma from "chroma-js"

class Color {
  constructor(hexCode) {
    this.hexCode = hexCode
  }
  hex() { return this.hexCode }
  name() { try {
    return GetColorName(this.hexCode)
  }
    catch(e) {
      console.log(e)
      console.log('%o',this.hexCode)
      return this.hexCode
    }

  }

  gray() {
    return new Color(chroma(this.hex()).desaturate(10).hex())
  }
  category() {
    return this.name()
  }
  hue() {
    return chroma(this.hex()).hsl()[0]
  }
  hsl() {
    return chroma(this.hex()).hsl().slice(0,3).map( (value) => {
      if (isNaN(value)) {
        return "NaN"
      }
      return Math.ceil(value * 100) / 100
    }).join()
  }

  darkest() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.max(0.05,hsl[2]/4)).hex())
  }
  dark() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.max(0.1,(hsl[2]/2))).hex())
  }
  lightest() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.min(0.95,hsl[2] * 4)).hex())
  }
  light() {
    const hsl = chroma(this.hex()).hsl()
    return new Color(chroma.hsl(hsl[0],hsl[1],Math.min(0.9,(hsl[2] * 2))).hex())
  }

  darken(amount) {
    const lab = chroma(this.hex()).lab()
    return new Color(chroma.lab(Math.max(lab[0] - amount,0),lab[1],lab[2]).hex())
  }
  lighten(amount) {
    const lab = chroma(this.hex()).lab()
    return new Color(chroma.lab(Math.min(lab[0] + amount,100),lab[1],lab[2]).hex())
  }

  contrast(other) {
    return chroma.contrast(this.hex(),other.hex())
  }

  rotateHue(degrees) {
    const hsl = chroma(this.hex()).hsl()
    if (isNaN(hsl[0])) {
      return this
    }
    else {
      const hue = (hsl[0] + degrees) % 360
      return new Color( chroma.hsl(hue,hsl[1],hsl[2]).hex() )
    }
  }
}

class ColorWheel {
  constructor({numColors,baseColors}) {
    this.numColors = numColors
    this.baseColor = baseColors[0]
    this.gray = this.baseColor.gray()
    this.colors = [ this.baseColor ]
    const degrees = 360 / numColors

    let added = false
    for(let i = 1; i < numColors; i++) {
      let newColor = this.colors[this.colors.length - 1].rotateHue(degrees)
      this.colors.push(newColor)
    }
  }

  eachColor(f) {
    this.colors.forEach(f)
    f(this.gray)
  }
}

class Swatch extends Component {
  constructor(element, color, tall) {
    super(element)
    this.color = color

    this.colorSquare = this.$("color")
    this.name        = this.$("name")
    this.hex         = this.$("hex")
    this.hsl         = this.$("hsl")

    this.colorSquare.style.backgroundColor = this.color.hex()
    if (tall) {
      this.colorSquare.classList.remove("h-5")
      this.colorSquare.classList.add("h-6")
    }
    else {
      this.colorSquare.classList.remove("h-6")
      this.colorSquare.classList.add("h-5")
    }
    this.name.textContent = this.color.name()
    this.hex.textContent = this.color.hex()
    //this.hsl.textContent = this.color.hsl()
  }
}

class Shades {
  constructor(color, numShades) {
    if (numShades != 5 && numShades != 7) {
      throw `Only 5 or 7 shades supported`
    }
    let darkest = color.darkest()
    let dark = color.dark()
    let lightest = color.lightest()
    let light = color.light()
    if (numShades == 5) {
      this.shades = [
        darkest,
        dark,
        color,
        light,
        lightest,
      ]
    }
    else {
      this.shades = [
        darkest,
        dark,
        dark.lighten(3),
        color,
        light.darken(3),
        light,
        lightest,
      ]
    }
  }
}

class ColorRow extends Component {
  constructor(element) {
    super(element)
    this.shades = this.$slot("shades")
  }
  addShade(swatch) {
    this.shades.appendChild(swatch.element)
  }
}

class PaletteGenerator {
  constructor(palette) {
    this.palette = palette
    this.row = palette.template("row")
    this.swatch = palette.template("swatch")
    this.numColors = 6
    this.numShades = 5
    this.color = new Color("#ff00ff")
  }

  rebuild({numColors,color,numShades}) {

    if (numColors) { this.numColors = numColors }
    if (numShades) { this.numShades = numShades }
    if (color)     { this.color = color }

    const hsl = chroma(this.color.hex()).hsl()
    console.log(this.color)
    this.color = new Color(
      chroma.hsl(
        hsl[0],
        1,
        hsl[2],
      ).hex()
    )
    console.log(this.color)

    const colorWheel = new ColorWheel({
      numColors: this.numColors,
      baseColors: [
        this.color,
      ]
    })

    this.palette.element.innerHTML = ""
    colorWheel.eachColor( (color) => {
      const colorRow = new ColorRow(this.row.newNode({ fillSlots: { name: color.category()} }))
      this.palette.element.appendChild(colorRow.element)
      const shades = new Shades(color,this.numShades)
      shades.shades.forEach( (color) => {
        const $swatch = this.swatch.newNode()
        const swatch = new Swatch($swatch,color, this.numColors <= 6)
        colorRow.addShade(swatch)
      })

    })
  }
}

class RadioButtons {
  constructor(form,selector,eventManager,valueTransform) {
    if (!valueTransform) {
      valueTransform = (x) => x
    }
    this.radioButtons = form.$selectors(selector)
    this.radioButtons.forEach( (radioButton) => {
      radioButton.addEventListener("input", (event) => {
        if (event.target.checked) {
          eventManager.fireEvent(valueTransform(event.target.value))
        }
      })
    })
  }
}

class ColorInput extends Component {
  constructor(element) {
    super(element)
    EventManager.defineEvents(this,"colorSelected")
    this.element.addEventListener("change", (event) => {
      this.colorSelectedEventManager.fireEvent(new Color(element.value))
    })
  }
}

class Form extends Component {
  constructor(element) {
    super(element)
    EventManager.defineEvents(this,"baseColorChanged","numColorsChanged", "numShadesChanged")

    this.colorPicker = new ColorInput(this.$selector("input[type=color]"))
    this.colorPicker.onColorSelected( (color) => this.baseColorChangedEventManager.fireEvent(color) )

    this.numColorsRadioButtons = new RadioButtons(
      this,
      "[name=num-colors]",
      this.numColorsChangedEventManager,
      parseInt
    )
    this.numShadesRadioButtons = new RadioButtons(
      this,
      "[name=num-shades]",
      this.numShadesChangedEventManager,
      parseInt
    )
  }

  numColors() {
    return parseInt(this._formData().get("num-colors"))
  }
  color() {
    return new Color(this._formData().get("color"))
  }
  numShades() {
    return parseInt(this._formData().get("num-shades"))
  }

  _formData() {
    return new FormData(this.element)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const body = new Body()
  const palette = new Component(body.$("palette"))
  const paletteGenerator = new PaletteGenerator(palette)
  const form = new Form(body.$selector("form"))

  form.onBaseColorChanged( (color)     => paletteGenerator.rebuild({color})     )
  form.onNumColorsChanged( (numColors) => paletteGenerator.rebuild({numColors}) )
  form.onNumShadesChanged( (numShades) => paletteGenerator.rebuild({numShades}) )

  paletteGenerator.rebuild({
    numColors: form.numColors(),
    color: form.color(),
    numShades: form.numShades(),
  })
})
