import { Component, Checkbox, EventManager } from "brutaljs"

export default class ViewForm extends Component {
  wasCreated(initialData) {
    EventManager.defineEvents(this,
                              "showColorDetails",
                              "hideColorDetails",
                              "showContrastInfo",
                              "hideContrastInfo",
                              "bigSwatches",
                              "noBigSwatches")


    this.showColorDetailsCheckbox = new Checkbox(this.$selector("[name='show-details']"))
    this.showColorDetailsCheckbox.onChecked(this.showColorDetailsEventManager)
    this.showColorDetailsCheckbox.onUnchecked(this.hideColorDetailsEventManager)

    this.showContrastInfoCheckbox = new Checkbox(this.$selector("[name='show-contrast']"))
    this.showContrastInfoCheckbox.onChecked(this.showContrastInfoEventManager)
    this.showContrastInfoCheckbox.onUnchecked(this.hideContrastInfoEventManager)

    this.bigSwatchesCheckbox = new Checkbox(this.$selector("[name='big-swatches']"))
    this.bigSwatchesCheckbox.onChecked(this.bigSwatchesEventManager)
    this.bigSwatchesCheckbox.onUnchecked(this.noBigSwatchesEventManager)

    this.showColorDetails = initialData.showColorDetails
    this.showContrastInfo = initialData.showContrastInfo
    this.bigSwatches      = initialData.bigSwatches
  }

  get showColorDetails()    { return this._formData().get("show-details") }
  set showColorDetails(val) { this.showColorDetailsCheckbox.checked = val }

  get showContrastInfo()    { return this._formData().get("show-contrast") }
  set showContrastInfo(val) { this.showContrastInfoCheckbox.checked = val }

  get bigSwatches()    { return this._formData().get("big-swatches") }
  set bigSwatches(val) { this.bigSwatchesCheckbox.checked = val }

  _formData() { return new FormData(this.element) }
}
