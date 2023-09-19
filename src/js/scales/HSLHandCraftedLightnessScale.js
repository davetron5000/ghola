import LinearLightnessScale from "./LinearLightnessScale"

export default class HSLHandCraftedLightnessScale extends LinearLightnessScale {
  constructor(baseColor,numShades) {
    super(baseColor,numShades)
    if (numShades == 5) {
      this.steps = [
        12,
        20,
        50,
        85,
        98,
      ]
    }
    else if (numShades == 7) {
      this.steps = [
        8,
        12,
        20,
        50,
        70,
        85,
        98,
      ]
    }
    for (let i = 1; i < this.steps.length; i++) {
      const prev = this.steps[i-1]
      if ( prev > baseColor.lightness() && this.steps[i] < baseColor.lightness() ) {
        this.steps[i-1] = baseColor.lightness()
      }
    }
  }
}
