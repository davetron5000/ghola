import TypeOf from "../TypeOf"

class TestFailure extends Error {
  constructor(failureMessage) {
    super(failureMessage)
  }
}

class TestError extends Error {
  constructor(caughtError) {
    super(caughtError)
  }
}

class TestAssertion {
  constructor(description, testFunction) {
    this.description    = description
    this.testFunction   = testFunction
  }
}

const test = (description,f) => {
  return new TestAssertion(description,() => {
    f()
    return new TestError("No assertions")
  })
}

const assertEqual = (expected,got,context) => {
  if (expected == got) {
    return
  }
  const message = `${context}\nExpected '${expected}' (type: ${TypeOf.asString(expected)})\nbut got   '${got}' (type: ${TypeOf.asString(got)})`
  throw new TestFailure(message)
}

const assertNotEqual = (expected,got,context) => {
  if (expected != got) {
    return
  }
  const message = `${context}\nDidn't expected '${expected}'\nto equal     '${got}'`
  throw new TestFailure(message)
}

const assert = (expr,context) => {
  if (expr) {
    return
  }
  throw new TestFailure(context)
}

const testCases = {}

const testCase = (id,testCaseCode) => {
  if (testCases[id]) {
    throw `There is already a test with id '${id}'`
  }
  testCases[id] = new TestCase(id,testCaseCode)
}

class Test {
  constructor(description,testCode) {
    this.description = description
    this.testCode = testCode
  }
}

class TestResult {
  constructor(test,numAssertions,errorOrFailure=null,errorOrFailureContext=null) {
    this.test                  = test
    this.numAssertions         = numAssertions
    this.errorOrFailure        = errorOrFailure
    this.errorOrFailureContext = errorOrFailureContext
  }

  get passed() { return !this.errorOrFailure }
  get failed() { return this.errorOrFailure instanceof TestFailure }
  get confidenceCheckFailed() { return this.errorOrFailure instanceof ConfidenceCheckFailed }
  get errored() {
    return !this.passed && !this.failed
  }

  get errorMessage() {
    if (this.errorOrFailure) {
      if (this.errorOrFailureContext) {
        return this.errorOrFailure.message + ` (CONTEXT: ${this.errorOrFailureContext})`
      }
      else {
        return this.errorOrFailure.message
      }
    }
    else {
      if (this.errorOrFailureContext) {
        return this.errorOrFailureContext
      }
      else {
        return "NO ERROR MESSSAGE"
      }
    }
  }
}

class ConfidenceCheckFailed extends Error {
}

class TestCase {
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

class Tests {
  static runTestCase(testCaseId, subject) {
    const testCase = testCases[testCaseId]
    if (testCase) {
      return testCase.run(subject)
    }
    else {
      return [
        new TestResult({ description: "locating the test" },0,`No test case with id ${testCaseId}`)
      ]
    }
  }
}

class TestCaseComponent extends HTMLElement {
  static observedAttributes = [
    "force-open",
  ]

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "force-open") {
      this.forceOpen = newValue == ""
    }
  }

  connectedCallback() {
    const subject = this.querySelector("g-test-case-subject")
    const details = this.querySelector("details")
    if (subject && this.id) {
      const $p = this.querySelector("p")
      const description = $p ? $p.textContent.trim() : this.id
      const formattedResults = Tests.runTestCase(this.id,subject).map( (result) => {
        if (result.passed) {
          return [
            "PASS",
            result.numAssertions,
            result.test.description,
            null,
            null,
          ]
        }
        else {
          return [
            result.failed ? "FAIL" : ( result.confidenceCheckFailed ? "CONFIDENCE CHECK FAILED" : "ERROR" ),
            result.numAssertions,
            result.test.description,
            result.test.errorMessage,
            result.errorOrFailure,
          ]
        }
      })
      if (formattedResults.some( (result) => result[0] != "PASS" )){
        console.group(description)
        if (details) {
          details.setAttribute("open",true)
        }
      }
      else {
        console.groupCollapsed(description)
        if (details) {
          details.removeAttribute("open")
        }
      }
      if (details && this.forceOpen) {
        details.setAttribute("open",true)
      }
      formattedResults.forEach( ([result,numAssertions,description,errorMessage,error]) => {
        console.log("[%c%s] %c%s (%d assertions)%s  %o",
          result == "PASS" ? "color: green;" : "color: red; font-weight: bold",
          result,
          "color: black; font-weight: normal",
          description,
          numAssertions,
          errorMessage ? ` ${errorMessage}` : "",
          error
        )
      })
      console.groupEnd()
    }
  }
  static tagName = "g-test-case"
  static define() {
    customElements.define(this.tagName, TestCaseComponent);
  }
}


export {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
  TestCaseComponent,
}
