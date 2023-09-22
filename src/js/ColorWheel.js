import HandCraftedWheel        from "./wheels/HandCraftedWheel"
import EqualHueBasedColorWheel from "./wheels/EqualHueBasedColorWheel"
import MonochromeColorWheel    from "./wheels/MonochromeColorWheel"

export default class ColorWheel {
  static wheel(name) {
    if (name == "EqualHueBased") {
      return EqualHueBasedColorWheel
    }
    if (name == "HandCrafted") {
      return HandCraftedWheel
    }
    else if (name == "Monochrome") {
      return MonochromeColorWheel
    }
    else {
      throw `No such wheel ${name}`
    }
  }

}

