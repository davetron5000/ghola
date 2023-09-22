import { Component } from "brutaldom"

export default class Debug extends Component {
  wasCreated() {
    this.p = this.$selector("p")
    this.ddPhase = this.$("phase")
    this.ddIndex = this.$("index")
    this.ddLength = this.$("length")
  }

  set content(val) { this.p.textContent = val; this._updatePhase() }
  set phase(val)   { this._phase = val; this._updatePhase() }
  set index(val)   { this.ddIndex.textContent = val; this._updatePhase() }
  set length(val)  { this.ddLength.textContent = val; this._updatePhase() }

  _updatePhase() { this.ddPhase.textContent = this._phase.toString() }
}
