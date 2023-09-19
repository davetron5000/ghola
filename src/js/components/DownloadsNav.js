import { Component, Link } from "brutaljs"

import CSVGenerator                   from "./generators/CSVGenerator"
import MelangeConfigurationGenerator  from "./generators/MelangeConfigurationGenerator"
import CSSVariablesGenerator          from "./generators/CSSVariablesGenerator"
import MelangeCSSVariablesGenerator   from "./generators/MelangeCSSVariablesGenerator"
import TailwindConfigurationGenerator from "./generators/TailwindConfigurationGenerator"

export default class DownloadsNav extends Component {
  static generators = {
    csv: CSVGenerator,
    css: CSSVariablesGenerator,
    melange: MelangeCSSVariablesGenerator,
    "melange-config": MelangeConfigurationGenerator,
    tailwind: TailwindConfigurationGenerator,
  }
  constructor(element, palette) {
    super(element)
    Object.entries(this.constructor.generators).forEach( ([ dataFragment, klass ]) => {
      const link = new Link(this.$(dataFragment))
      link.onClick( () => {
        const generator = new klass(palette)
        const url = URL.createObjectURL(generator.blob())
        window.location = url
      })
    })
  }
}

