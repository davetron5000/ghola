export default class NumericRange {
  constructor(start,end) {

    if (!start && start != 0) { throw `NumericRange requires a start: ${start}` }
    if (!end   && end   != 0) { throw `NumericRange requires an end: ${end}` }

    this.start = start
    this.end = end
    this.array = []
    for (let i=this.start;i < this.end; i++) {
      this.array.push(i)
    }
    if (start > end) {
      throw `${start} must be less than or equal to ${end}`
    }
  }

  forEach(f) { return this.array.forEach(f) }
  map(f)     { return this.array.map(f) }

  random() {
    return Math.floor(Math.random() * this.size) + this.start
  }

  get size() {
    return this.end - this.start
  }

  isWithin(number) {
    return number >= this.start && number < this.end
  }

  percent(number) {
    if (!this.isWithin(number)) {
      throw `${number} is not within this range ${this.start}..${this.end}`
    }
    const normalizedEnd  = (this.end-1) - this.start
    const normalizedNumber  = number - this.start
    return normalizedNumber / normalizedEnd
  }

  valueAtPercent(percent) {
    return Math.floor(this.start + ((this.end - this.start) * percent))
  }

  toString() {
    return `[${this.start}..${this.end})` 
  }
}
