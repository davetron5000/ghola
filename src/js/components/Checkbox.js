export default class Checkbox {
  constructor(form,selector,checkedEventManager,uncheckedEventManager) {
    this.checkbox = form.$selector(selector)
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
