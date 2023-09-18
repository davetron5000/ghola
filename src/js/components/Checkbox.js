export default class Checkbox {
  constructor(element,selector,checkedEventManager,uncheckedEventManager) {
    this.checkbox = element.$selector(selector)
    this.checkbox.addEventListener("input", (event) => {
      if (event.target.checked) {
        checkedEventManager.fireEvent()
      }
      else {
        uncheckedEventManager.fireEvent()
      }
    })
  }

  set checked(val) {
    this.checkbox.checked = String(val) == "true"
  }
}
