import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  suite,
} from "./brutaldom/testing"

import ColorSwatchComponent from "./components/ColorSwatchComponent"
import ColorNameComponent from "./components/ColorNameComponent"

suite("name-derived-from-color-input", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( ({require,clone}) => {
    const $colorName = clone(subject.querySelector(ColorNameComponent.tagName),"text input")
    const $swatch = clone(subject.querySelector(ColorSwatchComponent.tagName),"text input")
    const $input = require($colorName.querySelector("input[type=text]"),"text input")

    $swatch.id = `test-case-${$swatch.id}`
    $colorName.id = `test-case${$colorName.id}`

    document.body.appendChild($colorName)
    document.body.appendChild($swatch)

    $colorName.setAttribute("color-swatch",$swatch.id)

    return { $colorName, $input, $swatch }
  })

  teardown( ({$colorName, input,$swatch}) => {
    document.body.removeChild($colorName, input)
    document.body.removeChild($swatch)
  })

  test("by default, the input's value is the broad category name of the color",
    ({$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual("Red",$input.value,"<input>'s value should be Red")
    }
  )

  test("if the swatch's value changes, the input's value is updated",
    ({$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()
      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual("Green",$input.value,"<input>'s value should be Green")
    }
  )
  test("if the user has changed the input, changes to the swatch are ignored",
    ({$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      const override = "Maroon-esque"
      $input.value = override
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual(override,$input.value,"<input>'s value should be the same as what the user input")
      assert($input.dataset.userOverride,"<input> should have data-user-override set to allow detection of this situation")
    }
  )
  test("if the user has changed the input, then clears it, the name should be restored to the swatch's default",
    ({$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      const override = "Maroon-esque"
      $input.value = override
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      $input.value = ""
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      assertEqual("Green",$input.value,"<input>'s value should revert to the element's default")
      assert(!$input.dataset.userOverride,"<input> should not have data-user-override set")
    }
  )
})
