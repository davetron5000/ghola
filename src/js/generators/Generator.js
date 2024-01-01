export default class Generator {
  constructor(colorShades) {
    this.colorShades = colorShades
  }

  _eachColor({reverse,beforeGroup,afterGroup,onColor}) {

    if (!beforeGroup) { beforeGroup = () => {} }
    if (!afterGroup)  { afterGroup = () => {} }

    if (!onColor) {
      throw `onColor must be defined in _eachColor`
    }
    const namesUsed = {}
    this.colorShades.forEach( (colorShades) => {
      let name = colorShades.name.toString()
      if (namesUsed[name]) {
        namesUsed[name] = namesUsed[name] + 1
        name = `${name}${namesUsed[name]}`
      }
      else {
        namesUsed[name] = 1
      }
      beforeGroup(name)
      let scale = colorShades.scale
      if (reverse) {
        scale = scale.reverse()
      }
      scale.forEach( (color,index,array) => {
        onColor(name,color,index,array)
      })
      afterGroup(name)
    })
  }
}
