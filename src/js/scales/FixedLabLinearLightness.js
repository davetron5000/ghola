import FixedLabLightness    from "./FixedLabLightness"
import LinearLightnessScale from "./LinearLightnessScale"

export default class FixedLabLinearLightness extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LinearLightnessScale(baseColor,numShades,0) }
}
