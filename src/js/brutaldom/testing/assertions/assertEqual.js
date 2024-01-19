import TypeOf from "../../TypeOf"
import TestFailure from "../TestFailure"

export default assertEqual = (expected,got,context) => {
  if (expected == got) {
    return
  }
  const message = `${context}\nExpected '${expected}' (type: ${TypeOf.asString(expected)})\nbut got   '${got}' (type: ${TypeOf.asString(got)})`
  throw new TestFailure(message)
}

