import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
} from "../brutaldom/testing"

testCase("preview-text-colors", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( ({subject,require,clone}) => {
    const $previewText = clone(subject.children[0],"child")
    document.body.appendChild($previewText)
    return ({$previewText})
  })
  teardown( ({$previewText}) => {
    document.body.removeChild($previewText)
  })

  test("the attributes flow to the styles",
    ({$previewText}) => {
      assertEqual("rgb(0, 0, 0)",$previewText.style.backgroundColor)
      assertEqual("rgb(255, 255, 255)",$previewText.style.color)
    }
  )
  test("removing the attributes sets reasonable defaults",
    ({$previewText}) => {
      $previewText.removeAttribute("background-color")
      $previewText.removeAttribute("text-color")
      assertEqual("transparent",$previewText.style.backgroundColor)
      assertEqual("currentcolor",$previewText.style.color)
    }
  )

})
