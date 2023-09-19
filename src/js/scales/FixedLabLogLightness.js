import FixedLabLightness from "./FixedLabLightness"
import LogLightnessScale from "./LogLightnessScale"

export default class FixedLabLogLightness extends FixedLabLightness {
  _scale(baseColor,numShades) { return new LogLightnessScale(baseColor,numShades, 0,16,4, 1, 1, 0.6) }
}
