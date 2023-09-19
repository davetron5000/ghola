import LinearLightnessScale from "./LinearLightnessScale"

export default class LabHandCraftedLightnessScale extends LinearLightnessScale {
  constructor(baseColor,numShades) {
    super(baseColor,numShades)
    if (numShades == 5) {
      this.steps = [
        1,
        20,
        50,
        85,
        100,
      ]
    }
    else if (numShades == 7) {
      this.steps = [
        1,
        12,
        30,
        50,
        70,
        85,
        100,
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
