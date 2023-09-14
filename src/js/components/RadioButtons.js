export default class RadioButtons {
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

  set selected(val) {
    this.radioButtons.forEach( (radioButton) => {
      if (radioButton.value == val) {
        radioButton.checked = true
      }
      else {
        radioButton.checked = false
      }
    })
  }
}
