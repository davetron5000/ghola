export default class NumericRange {
  constructor(start,end) {

    if (!start && start != 0) { throw `NumericRange requires a start: ${start}` }
    if (!end   && end   != 0) { throw `NumericRange requires an end: ${end}` }

    this.start = start
    this.end = end
    if (start > end) {
      throw `${start} must be less than or equal to ${end}`
    }
  }

  isWithin(number) {
    return number >= this.start && number < this.end
  }

  percent(number) {
    if (!this.isWithin(number)) {
      throw `${number} is not within this range ${this.start}..${this.end}`
    }
    const normalizedEnd  = this.end - this.start
    const normalizedNumber  = number - this.start
    return normalizedNumber / normalizedEnd
  }

  valueAtPercent(percent) {
    return Math.floor(this.start + ((this.end - this.start) * percent))
  }
}
