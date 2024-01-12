import HasAttributes from "../../brutaldom/HasAttributes"

class ButtonAccentEnhancement extends HTMLElement {
  static attributeListeners = {
    "color": {},
    "icon": {},
    "icon-description": {},
  }

  connectedCallback() {
    this.button = this.querySelector("button")
    this.render()
  }

  render() {
    if (!this.color) {
      return
    }
    if (!this.button) {
      return
    }
    this.button.classList.add(
      `${this.color}-darker`,
      `bg-${this.color}-lightest`,
      `hover-bg-${this.color}-lighter`,
      `bc-${this.color}-darker`,
      "w-100"
    )
    this.button.classList.forEach( (cssClass) => {
      if (/flex-grow/.test(cssClass)) {
        this.classList.add(cssClass)
      }
    })
    if (this.icon && this.iconDescription) {
      const text = this.button.textContent

      const icon  = document.createElement("span")
      const label = document.createElement("span")

      icon.setAttribute("role","img")
      icon.setAttribute("aria-label",this.iconDescription)
      icon.classList.add("mr-1")
      icon.textContent = this.icon

      label.textContent = text

      this.button.textContent = ""
      this.button.appendChild(icon)
      this.button.appendChild(label)
    }
  }

  static tagName = "g-pe-button-accent"
  static define() {
    customElements.define(this.tagName, ButtonAccentEnhancement);
  }
}
HasAttributes.mixInto(ButtonAccentEnhancement)
export default ButtonAccentEnhancement
