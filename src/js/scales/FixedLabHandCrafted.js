import FixedLabLightness            from "./FixedLabLightness"
import LabHandCraftedLightnessScale from "./LabHandCraftedLightnessScale"

export default class FixedLabHandCrafted extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LabHandCraftedLightnessScale(baseColor,numShades) }
}
