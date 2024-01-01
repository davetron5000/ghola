export default class ColorShades {
  constructor(name,scale) {
    if (!name)  { throw `name is required to create a ColorShades` }
    if (!scale) { throw `scale is required to create a ColorShades` }
    this.name  = name
    this.scale = scale
  }
}
