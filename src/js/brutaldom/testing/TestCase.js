import TypeOf from "../TypeOf"
import Test from "./Test"
import TestResult from "./TestResult"
import TestAssertion from "./TestAssertion"
import TestError from "./TestError"
import TestFailure from "./TestFailure"
import ConfidenceCheckFailed from "./ConfidenceCheckFailed"
import assert from "./assertions/assert"
import assertNotEqual from "./assertions/assertNotEqual"
import assertEqual from "./assertions/assertEqual"

const test = (description,f) => {
  return new TestAssertion(description,() => {
    f()
    return new TestError("No assertions")
  })
}

export default class TestCase {
  constructor(id,testCaseCode) {
    this.id = id
    this.testCaseCode = testCaseCode
  }
  run(subject) {
    let setups = []
    let teardowns = []

    let confidenceChecks = []

    const captureSetup = (f)           => { setups.push(f) }
    const captureTeardown = (f)        => { teardowns.push(f) }
    const captureConfidenceCheck = (f) => { confidenceChecks.push(f) }

    let tests = []

    const captureTest = (description,f) => {
      tests.push(new Test(description,f))
    }

    let assertionsThisTest = 0
    const capturingAssert = (f) => {
      return (...args) => {
        assertionsThisTest = assertionsThisTest + 1
        return f(...args)
      }
    }

    this.testCaseCode({
      setup: captureSetup,
      teardown: captureTeardown,
      test: captureTest,
      subject: subject,
      assert: capturingAssert(assert),
      assertEqual: capturingAssert(assertEqual),
      assertNotEqual: capturingAssert(assertNotEqual),
      confidenceCheck: captureConfidenceCheck,
    })

    const results = []

    const require = (element,description,elementSearched) => {
      if (!element) {
        throw `Required element not found: ${description}${ elementSearched ? "HTML: " + elementSearched.outerHTML : '' }`
      }
      return element
    }
    const clone = (element,description) => {
      const cloned = require(element,description).cloneNode(true)
      cloned.dataset["testCaseId"] = this.id
      return cloned
    }

    tests.forEach( (test) => {
      assertionsThisTest = 0
      try {
        let setupResults = {}
        setups.forEach( (setup) => {
          const results = setup({subject,require,clone,...setupResults})
          setupResults = { ...results, ...setupResults }
        })
        try {
          try {
            confidenceChecks.forEach( (confidenceCheck) => {
              confidenceCheck(setupResults)
            })
          } catch (e) {
            throw new ConfidenceCheckFailed(e)
          }
          test.testCode(setupResults)
          results.push(new TestResult(test,assertionsThisTest))
        }
        catch (e) {
          results.push(new TestResult(test,assertionsThisTest,e))
        }
        try {
          teardowns.forEach( (teardown) => {
            teardown(setupResults)
          })
        }
        catch (e) {
          results.push(new TestResult(test,assertionsThisTest,e,"from teardown()"))
        }
      }
      catch (e) {
        results.push(new TestResult(test,assertionsThisTest,e,"from setup()"))
      }
    })
    if (results.length == 0) {
      results.push(new TestResult({description:""},0,"No tests"))
    }
    return results
  }
}
