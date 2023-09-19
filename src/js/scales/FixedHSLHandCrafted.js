import FixedHSLLightness            from "./FixedHSLLightness"
import HSLHandCraftedLightnessScale from "./HSLHandCraftedLightnessScale"

export default class FixedHSLHandCrafted extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new HSLHandCraftedLightnessScale(baseColor,numShades) }
}
