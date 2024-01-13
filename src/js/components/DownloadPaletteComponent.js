import BaseCustomElement      from "../brutaldom/BaseCustomElement"
import ColorShades            from "../generators/ColorShades"
import CSSGenerator           from "../generators/CSSGenerator"
import CSVGenerator           from "../generators/CSVGenerator"
import MelangeConfigGenerator from "../generators/MelangeConfigGenerator"
import MelangeGenerator       from "../generators/MelangeGenerator"
import TailwindGenerator      from "../generators/TailwindGenerator"

export default class DownloadPaletteComponent extends BaseCustomElement {

  static tagName = "g-download-palette"
  static observedAttributes = [
    "palette",
    "generator",
    "debug",
  ]

  static generators = {
    "css": CSSGenerator,
    "melange": MelangeGenerator,
    "melange-config": MelangeConfigGenerator,
    "tailwind": TailwindGenerator,
    "csv": CSVGenerator,
  }

  constructor() {
    super()
    this.linkClickListener = (event) => {
      this._generate()
    }
  }

  paletteChangedCallback({newValue}) {
    if (newValue) {
      this.palette = document.getElementById(newValue)
      if (this.isConnected && !this.palette) {
        this.logger.warn("No such element in the document with id '%s'",newValue)
      }
    }
    else {
      this.palette = null
      this.link.removeEventListener("click",this.linkClickListener)
    }
  }

  generatorChangedCallback({newValue}) {
    if (newValue) {
      this.generator = this.constructor.generators[newValue]
      if (!this.generator) {
        this.logger.warn("No such generator '%s'",newValue)
      }
    }
    else {
      this.generator = null
    }
  }

  render() {
    this.link.addEventListener("click",this.linkClickListener)
  }
  
  _generate() {
    if (this.palette && this.generator) {
      const colorShades = Array.from(this.palette.querySelectorAll("g-palette-color-scale")).map( (paletteColorScale) => {
        return new ColorShades(
          paletteColorScale.colorName,
          paletteColorScale.colorScale
        )
      }).filter( (x) => !!x )

      const blob = new this.generator(colorShades).blob()
      const url = URL.createObjectURL(blob)
      window.location = url
    }
  }

  get link() {
    const links = this.querySelectorAll("a")
    if (links.length == 0) {
      this.logger.warn("No links found inside element")
      return
    }
    if (links.length > 1) {
      this.logger.warn("More than one link found - behavior is not defined")
    }
    return links[0]
  }

}
