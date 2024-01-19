import Palette from "./Palette"

export default class UnsaveableState {
  start() { }
  savePalette(palette) {
    this.palette = palette
  }
  loadPalette() {
    return this.palette || new Palette()
  }
}
