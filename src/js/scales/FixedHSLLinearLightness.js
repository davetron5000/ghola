import FixedHSLLightness    from "./FixedHSLLightness"
import LinearLightnessScale from "./LinearLightnessScale"

export default class FixedHSLLinearLightness extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new LinearLightnessScale(baseColor,numShades) }
}
