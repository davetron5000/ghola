export default class Answer {
  constructor({color,answer,correctAnswer}) {
    this.color         = color
    this.answer        = answer
    this.correctAnswer = correctAnswer
  }

  isCorrect() {
    if (this.answer) {
      return this.answer.toString() == this.correctAnswer.toString()
    }
    return false
  }

  hsl() {
    const [h,s,l] = this.color.chroma().hsl()
    return [
      Math.floor(h),
      Math.floor(s * 100),
      Math.floor(l * 100),
    ]
  }
}
