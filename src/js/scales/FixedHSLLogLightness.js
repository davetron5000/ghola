import FixedHSLLightness from "./FixedHSLLightness"
import LogLightnessScale from "./LogLightnessScale"

export default class FixedHSLLogLightness extends FixedHSLLightness {
  _scale(baseColor,numShades) { return new LogLightnessScale(baseColor,numShades) }
}
