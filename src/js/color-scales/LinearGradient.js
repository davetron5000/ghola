import BaseGradient from "./BaseGradient"

export default class LinearGradient extends BaseGradient {
  valueFor(index,numSwatches) {
    const middle = (numSwatches - 1) / 2
    if (index < middle) {
      const step = index
      const totalSteps = middle
      const min = 40
      const max = 80

      const percentAlongRange = step / (totalSteps - 1)
      const percentage = Math.floor(max - (percentAlongRange * (max - min)))

      return [ "darken-by", percentage ]
    }
    else {
      const step = (numSwatches - 1) - index
      const totalSteps = middle
      const min = 30
      const max = 90

      const percentAlongRange = step / (totalSteps - 1)
      const percentage = Math.floor(max - (percentAlongRange * (max - min)))
      return [ "brighten-by", percentage ]
    }
  }
}
