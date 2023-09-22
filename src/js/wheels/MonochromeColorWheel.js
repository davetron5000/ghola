import EqualHueBasedColorWheel from "./EqualHueBasedColorWheel"

export default class MonochromeColorWheel extends EqualHueBasedColorWheel {
  constructor({numColors,baseColors}) {
    super({numColors: baseColors.filter( (x) => !!x).length,baseColors})
  }
}
