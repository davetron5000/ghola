import testCases from "./testCases"
import TestResult from "./TestResult"

export default class TestCaseComponent extends HTMLElement {
  static observedAttributes = [
    "force-open",
  ]

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
      const formattedResults = this.constructor.runTestCase(this.id,subject).map( (result) => {
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

