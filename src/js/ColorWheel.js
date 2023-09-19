import HandCraftedWheel        from "./wheels/HandCraftedWheel"
import EqualHueBasedColorWheel from "./wheels/EqualHueBasedColorWheel"

export default class ColorWheel {
  static wheel(name) {
    if (name == "EqualHueBased") {
      return EqualHueBasedColorWheel
    }
    if (name == "HandCrafted") {
      return HandCraftedWheel
    }
    else {
      throw `No such wheel ${name}`
    }
  }

}

