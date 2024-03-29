import {
  testCase,
} from "../brutaldom/testing"

import ColorSwatchComponent from "./ColorSwatchComponent"
import ColorNameComponent from "./ColorNameComponent"

const basicSetup = ({require,clone,subject}) => {
  const $colorName = clone(subject.querySelector(ColorNameComponent.tagName),"text input")
  const $swatch = clone(subject.querySelector(ColorSwatchComponent.tagName),"text input")
  const $input = require($colorName.querySelector("input[type=text]"),"text input")

  $swatch.id = `test-case-${$swatch.id}`
  $colorName.id = `test-case${$colorName.id}`

  document.body.appendChild($colorName)
  document.body.appendChild($swatch)

  $colorName.setAttribute("color-swatch",$swatch.id)

    return { $colorName, $input, $swatch }
}

const basicTeardown = ({$colorName,$swatch}) => {
  document.body.removeChild($colorName)
  document.body.removeChild($swatch)
}

testCase("name-derived-from-color-input", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(basicSetup)
  teardown(basicTeardown)

  test("by default, the input's value is the broad category name of the color",
    ({$colorName,$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual("Red",$input.value,"<input>'s value should be Red")
      assertEqual("Red",$colorName.name,"The name attribute should return the value")
      assert(!$colorName.userOverride,"Since the value is the default, userOverride should be false")
    }
  )

  test("if the swatch's value changes, the input's value is updated",
    ({$colorName,$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()
      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual("Green",$input.value,"<input>'s value should be Green")
      assertEqual("Green",$colorName.name,"The name attribute should return the value")
      assert(!$colorName.userOverride,"Since the value is the default, userOverride should be false")
    }
  )
  test("if the user has changed the input, a data- attribute is set, an event fired, and changes to the swatch are ignored",
    ({$colorName,$input,$swatch}) => {
      let eventReceived
      $colorName.addEventListener("name-change", (event) => {
        eventReceived = event
      })

      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      const override = "Maroon-esque"
      $input.value = override
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      assertEqual(override,$input.value,"<input>'s value should be the same as what the user input")
      assert($input.dataset.userOverride,"<input> should have data-user-override set to allow detection of this situation")
      assertEqual(override,$colorName.name,"The name attribute should return the value")
      assert($colorName.userOverride,"Since the user has overridden the value, userOverride should be true")
      assert(eventReceived,"An event should've been received")
    }
  )
  test("if the user has changed the input, then clears it, the name should be restored to the swatch's default",
    ({$colorName,$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()

      const override = "Maroon-esque"
      $input.value = override
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      $swatch.setAttribute("hex-code","#00ff00")
      $swatch.forTesting.dispatchHexCodeChanged()

      let eventReceived
      $colorName.addEventListener("name-cleared", (event) => {
        eventReceived = event
      })

      $input.value = ""
      $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      assertEqual("Green",$input.value,"<input>'s value should revert to the element's default")
      assert(!$input.dataset.userOverride,"<input> should not have data-user-override set")
      assert(eventReceived,"An event should've been received")
    }
  )
})

testCase("name-override-via-method-color-input", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(basicSetup)
  teardown(basicTeardown)
  test("the value should be the overridden value from the attribute",
    ({$colorName,$input,$swatch}) => {
      $swatch.setAttribute("hex-code","#ff0000")
      $swatch.forTesting.dispatchHexCodeChanged()
      $colorName.overrideColorName("Puce")

      assertEqual("Puce",$input.value,"<input>'s value should what was provided in the attribute")
      assert($input.dataset.userOverride,"<input> should have data-user-override set to allow detection of this situation")
    }
  )
})
