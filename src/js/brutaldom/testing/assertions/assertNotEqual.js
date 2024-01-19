import TestFailure from "../TestFailure"

export default assertNotEqual = (expected,got,context) => {
  if (expected != got) {
    return
  }
  const message = `${context}\nDidn't expected '${expected}'\nto equal     '${got}'`
  throw new TestFailure(message)
}

