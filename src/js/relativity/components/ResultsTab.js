import { Link } from "brutaldom"

export default class ResultsTab extends Link {
  wasCreated(classesOnTabCurrent, classesOnTabNotCurrent) {
    super.wasCreated()
    this.classesOnTabCurrent    = classesOnTabCurrent
    this.classesOnTabNotCurrent = classesOnTabNotCurrent
  }

  notCurrent() {
    this.element.classList.remove(...this.classesOnTabCurrent)
    this.element.classList.add(...this.classesOnTabNotCurrent)
    this.element.setAttribute("aria-selected",false)
  }
  current() {
    this.element.classList.remove(...this.classesOnTabNotCurrent)
    this.element.classList.add(...this.classesOnTabCurrent)
    this.element.setAttribute("aria-selected",true)
  }
}
