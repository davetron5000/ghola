import { Component, EventManager } from "brutaljs"
import Checkbox from "./Checkbox"

export default class ViewForm extends Component {
  constructor(element, initialData) {
    super(element)
    EventManager.defineEvents(this,
                              "showColorDetails",
                              "hideColorDetails",
                              "showContrastInfo",
                              "hideContrastInfo",
                              "bigSwatches",
                              "noBigSwatches")


    this.showColorDetailsCheckbox = new Checkbox(
      this,"[name='show-details']",
      this.showColorDetailsEventManager,
      this.hideColorDetailsEventManager,
    )

    this.showContrastInfoCheckbox = new Checkbox(
      this,"[name='show-contrast']",
      this.showContrastInfoEventManager,
      this.hideContrastInfoEventManager,
    )

    this.bigSwatchesCheckbox = new Checkbox(
      this,"[name='big-swatches']",
      this.bigSwatchesEventManager,
      this.noBigSwatchesEventManager,
    )

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
