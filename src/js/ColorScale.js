import FixedHSLLinearLightness from "./scales/FixedHSLLinearLightness"
import FixedHSLLogLightness    from "./scales/FixedHSLLogLightness"
import FixedHSLHandCrafted     from "./scales/FixedHSLHandCrafted"
import FixedLabLinearLightness from "./scales/FixedLabLinearLightness"
import FixedLabLogLightness    from "./scales/FixedLabLogLightness"
import FixedLabHandCrafted     from "./scales/FixedLabHandCrafted"
import EnsureContrast          from "./scales/EnsureContrast"
import ChromaScale             from "./scales/ChromaScale"

export default class ColorScale {
  static scale(name) {
    if (name == "FixedHSLLinearLightness") {
      return FixedHSLLinearLightness
    }
    else if (name == "FixedHSLLogLightness") {
      return FixedHSLLogLightness
    }
    else if (name == "FixedHSLHandCrafted") {
      return FixedHSLHandCrafted
    }
    else if (name == "FixedLabLinearLightness") {
      return FixedLabLinearLightness
    }
    else if (name == "FixedLabLogLightness") {
      return FixedLabLogLightness
    }
    else if (name == "FixedLabHandCrafted") {
      return FixedLabHandCrafted
    }
    else if (name == "EnsureContrast") {
      return EnsureContrast
    }
    else if (name == "Chroma") {
      return ChromaScale
    }
    else {
      throw `No such scale ${name}`
    }
  }
}
