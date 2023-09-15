export default class Select {
  constructor(form,selector,eventManager) {
    this.select = form.$selector(selector)
    this.select.addEventListener("input", (event) => {
      eventManager.fireEvent(event.target.value)
    })
  }

  set selected(val) {
    Array.from(this.select.options).forEach( (option) => {
      if (option.value == val) {
        option.selected = true
      }
      else {
        option.selected = false
      }
    })
  }
}
