import { Body, Component, Link, Template } from "brutaldom"
import Color from "../../Color"

document.addEventListener("DOMContentLoaded", () => {
  const body  = new Body()

  const gray = new Component(body.$("gray"))
  const template = gray.template()
  for (let lightness=0; lightness <= 100; lightness = lightness + 0.333) {
    const color = Color.gray(lightness)
    const [h,s,l] = color.chroma().hsl()
    const node = template.newNode({ fillSlots: {
      hex: color.hex(),
      hsl: `L: ${Math.floor(lightness * 100) / 100}`,
    }})
    node.style.backgroundColor = color.hex()
    node.style.color = lightness < 50 ? "#fff" : "#000"
    gray.element.appendChild(node)
  }

})
