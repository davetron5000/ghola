import Color from "../../Color"
import ArrayShuffler from "../../ArrayShuffler"

export default class Demonstration {
  static random() {
    const color = Color.random()
    const left = Color.random(color)
    const right = Color.random(color,left)
    return new Demonstration({color,left,right,type: "random"})
  }
  static knownDifferent() {
    return ArrayShuffler.shuffle([
      new Demonstration({
        color: Color.fromRGB(154,  72,  14),
        left:  Color.fromRGB(252, 113,   9),
        right: Color.fromRGB(52,  119, 166),
        type: "known-different",
      }),
      new Demonstration({
        color: Color.fromRGB(150,41,13),
        left:  Color.fromRGB(52, 33, 34),
        right: Color.fromRGB(184,47,0),
        type: "known-different",
      }),
      new Demonstration({
        color: Color.fromRGB(144,195,42),
        left: Color.fromRGB(101,237,174),
        right: Color.fromRGB(215,182,27),
        type: "known-different",
      }),
      new Demonstration({
        color: Color.fromRGB(22,117,47),
        left: Color.fromRGB(43,229,86),
        right: Color.fromRGB(12,55,24),
        type: "known-different",
      }),
      new Demonstration({
        color: Color.fromRGB(109,109,109),
        left: Color.fromRGB(80,142,141),
        right: Color.fromRGB(140,76,77),
        type: "known-different",
      }),
    ])
  }
  constructor({ color, left, right, type }) {
    if (!color) { throw `color is required` }
    if (!left) { throw `left is required` }
    if (!right) { throw `right is required` }
    if (!type) { throw `type is required` }
    this.color = color
    this.left  = left
    this.right = right
    this.type = type
  }
}
