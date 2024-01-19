import TestFailure from "./TestFailure"
import ConfidenceCheckFailed from "./ConfidenceCheckFailed"

export default class TestResult {
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
