import { Component } from "brutaldom"
import ResultsTab from "./ResultsTab"
import ResultsPanel from "./ResultsPanel"

export default class Results extends Component {
  wasCreated() {
    this.tabTemplate = this.template("tab")
    const swatchTemplate = this.template("swatch")
    this.tabs = {}
    const $nav = this.$selector("nav")

    const classesOnTabCurrent    = $nav.dataset.tabCurrentClasses.split(/ /)
    const classesOnTabNotCurrent = $nav.dataset.tabNotCurrentClasses.split(/ /)

    this.$selectors("nav [aria-controls]").forEach( (element) => {
      const name = element.getAttribute("aria-controls")
      this.tabs[name] = {}
      this.tabs[name].tab = new ResultsTab(element, classesOnTabCurrent, classesOnTabNotCurrent)
      const panelNode = this.tabTemplate.newNode({
        fillSlots: {
          title: element.textContent,
          explanation: element.dataset.explanation,
        }
      })
      panelNode.setAttribute("id",name)
      panelNode.setAttribute("aria-labeled-by",`tab-${name}`)
      this.element.appendChild(panelNode)
      this.tabs[name].panel = new ResultsPanel(panelNode, swatchTemplate)
      this.tabs[name].panel.hide()
    })
    Object.entries(this.tabs).forEach( ([ key, object ]) => {
      object.tab.onClick( () => {
        Object.values(this.tabs).forEach( (value) => {
          value.panel.hide()
          value.tab.notCurrent()
        })
        object.panel.show()
        object.tab.current()
      })
    })
  }

  show(reflections) {
    super.show()

    const analysis = {
      influential: reflections.map( (reflection) => reflection.influentialColors() ).flat(),
      impressionable: reflections.map( (reflection) => reflection.impressionableColors() ).flat(),
      resists: reflections.map( (reflection) => reflection.resistantColors() ).flat(),
      not_influential: reflections.map( (reflection) => reflection.nonInfluentialColors() ).flat(),
    }

    Object.entries(analysis).forEach( ([key,colors]) => {
      this.tabs[key].panel.colors = colors
    })
    this.tabs.influential.panel.show()
    this.tabs.influential.tab.current()
  }
}
