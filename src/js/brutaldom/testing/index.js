import TestCase from "./TestCase"
import testCases from "./testCases"

const testCase = (id,testCaseCode) => {
  if (testCases[id]) {
    throw `There is already a test with id '${id}'`
  }
  testCases[id] = new TestCase(id,testCaseCode)
}


export {
  testCase,
}
