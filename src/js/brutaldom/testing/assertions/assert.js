import TestFailure from "../TestFailure"

export default assert = (expr,context) => {
  if (expr) {
    return
  }
  throw new TestFailure(context)
}
