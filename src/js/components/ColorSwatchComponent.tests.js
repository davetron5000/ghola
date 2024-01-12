import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
} from "../brutaldom/testing"

import Color from "../Color"

const singleDerviedSetup = ({subject,clone,require}) => {
  const $derived = clone(subject.children[0],"children[0]")
  const $main   = clone(subject.children[1],"children[1]")

  const $derivedInput = require($derived.querySelector("input[type=color]"),"derived input")
  const $derivedLabel = require($derived.querySelector("label code"),"derived label's code")

  document.body.appendChild($main)
  document.body.appendChild($derived)

  $main.id = `test-case-${$main.id}`
  $derived.id = `test-case-${$derived.id}`
  $derived.setAttribute("derived-from",$main.id)

  return {
    $derivedInput,
    $derivedLabel,
    $main,
    $derived,
  }
}
const singleDerviedTeardown = ({$main,$derived}) =>  {
  document.body.removeChild($main)
  document.body.removeChild($derived)
}


testCase("derived-brighter-linear", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( singleDerviedSetup )
  teardown( singleDerviedTeardown )

  test("manipulating the main causes the others to derive values",
    ({$main,$derived,$derivedInput,$derivedLabel}) => {
      $main.setAttribute("hex-code","#453888")

      assertEqual("#998ed1",$derivedInput.value.toLowerCase(), "Value should be derived via brightness algorithm")
      assertEqual("#998ed1",$derivedLabel.textContent.toLowerCase(), "Value should be derived via brightness algorithm")
    }
  )
})
testCase("derived-darker-linear", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( singleDerviedSetup )
  teardown( singleDerviedTeardown )

  test("manipulating the main causes the others to derive values",
    ({$main,$derived,$derivedInput,$derivedLabel}) => {
      $main.setAttribute("hex-code","#888555")

      assertEqual("#44432b",$derivedInput.value.toLowerCase(), "Value should be derived via brightness algorithm")
      assertEqual("#44432b",$derivedLabel.textContent.toLowerCase(), "Value should be derived via brightness algorithm")
    }
  )
})

testCase("derived-complement", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( singleDerviedSetup )
  teardown( singleDerviedTeardown )
  test("manipulating the main causes the other to derive the derivedary value",
    ({$main,$derived,$derivedInput,$derivedLabel}) => {
      $main.setAttribute("hex-code","#334488")

      assertEqual("#887733",$derivedInput.value, "Value should be derived via derived algorithm")
      assertEqual("#887733",$derivedLabel.textContent,"Value should be derived via derived algorithm")
    }
  )
})

const lowerUpperSetup = ({subject,clone,require}) => {
  const $lower = clone(subject.children[0],"children[0]")
  const $main  = clone(subject.children[1],"children[1]")
  const $upper = clone(subject.children[2],"children[2]")

  const $lowerInput = require($lower.querySelector("input[type=color]"),"lower input")
  const $lowerLabel = require($lower.querySelector("label code"),"lower label's code")
  const $upperInput = require($upper.querySelector("input[type=color]"),"upper input")
  const $upperLabel = require($upper.querySelector("label code"),"upper label's code")

  document.body.appendChild($lower)
  document.body.appendChild($main)
  document.body.appendChild($upper)

  $main.id = `test-case-${$main.id}`
  $lower.id = `test-case-${$lower.id}`
  $upper.id = `test-case-${$upper.id}`
  $lower.setAttribute("derived-from",$main.id)
  $upper.setAttribute("derived-from",$main.id)

  return {
    $lower,
    $lowerInput,
    $lowerLabel,
    $main,
    $upper,
    $upperInput,
    $upperLabel,
  }
}

const lowerUpperTeardown = ({$lower,$main,$upper}) => {
  document.body.removeChild($lower)
  document.body.removeChild($main)
  document.body.removeChild($upper)
}

testCase("derived-split-complement", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( lowerUpperSetup )
  teardown( lowerUpperTeardown )

  test("manipulating the main causes the other to derive the complementary value",
    ({$main,$upperInput,$upperLabel,$lowerInput,$lowerLabel}) => {
      $main.setAttribute("hex-code","#334488")

      assertEqual("#6E8833",$lowerInput.value.toUpperCase(), "Value should be derived via split complement lower algorithm")
      assertEqual("#6E8833",$lowerLabel.textContent.toUpperCase(),"Value should be derived via split complement lower algorithm")
      assertEqual("#884D33",$upperInput.value.toUpperCase(), "Value should be derived via split complement upper algorithm")
      assertEqual("#884D33",$upperLabel.textContent.toUpperCase(),"Value should be derived via split complement upper algorithm")
    }
  )
})

testCase("derived-analogous", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( lowerUpperSetup )
  teardown( lowerUpperTeardown )

  test("manipulating the main causes the others to derive analogous values",
    ({$main,$upperInput,$upperLabel,$lowerInput,$lowerLabel}) => {
      $main.setAttribute("hex-code","#334488")

      assertEqual("#4D3388",$lowerInput.value.toUpperCase(), "Value should be derived via analogous lower algorithm")
      assertEqual("#4D3388",$lowerLabel.textContent.toUpperCase(),"Value should be derived via analogous lower algorithm")
      assertEqual("#336E88",$upperInput.value.toUpperCase(), "Value should be derived via analogous upper algorithm")
      assertEqual("#336E88",$upperLabel.textContent.toUpperCase(),"Value should be derived via analogous upper algorithm")
    }
  )
})

testCase("derived-triad", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( lowerUpperSetup )
  teardown( lowerUpperTeardown )

  test("manipulating the main causes the others to derive triad values",
    ({$main,$upperInput,$upperLabel,$lowerInput,$lowerLabel}) => {
      $main.setAttribute("hex-code","#334488")

      assertEqual("#448833",$lowerInput.value, "Value should be derived via triad lower algorithm")
      assertEqual("#448833",$lowerLabel.textContent,"Value should be derived via triad lower algorithm")
      assertEqual("#883344",$upperInput.value, "Value should be derived via triad upper algorithm")
      assertEqual("#883344",$upperLabel.textContent,"Value should be derived via triad upper algorithm")
    }
  )


})

testCase("derived-disconnected", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( lowerUpperSetup )
  teardown( lowerUpperTeardown )

  test("disconnecting one from the main stops responding to events",
    ({$main,$upper, $upperInput,$lowerInput}) => {
      $upper.setAttribute("show-warnings","upper")
      $upper.removeAttribute("derived-from")
      $upper.removeAttribute("derivation-algorithm")
      $upperInput.value = "#123456"
      $upperInput.dispatchEvent(new Event("change"))
      $main.setAttribute("hex-code","#334488")
      console.log($upper)

      assertEqual("#448833",$lowerInput.value, "Value should be derived via triad lower algorithm")
      assertEqual("#123456",$upperInput.value, "Value should NOT be derived via triad upper algorithm")
    }
  )


})

testCase("base-case", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( () => {
    const component = subject.children[0].cloneNode(true)
    const $input = component.querySelector("input[type=color]")
    const $label = component.querySelector("label")

    if (!$input) { 
      throw "No <input[type=color]>"
    }
    if (!$label) {
      throw "No <label>"
    }
    document.body.appendChild(component)
    return {component,$input,$label}
  })
  teardown( ({component,}) => {
    document.body.removeChild(component)
  })
  test("hex-code attribute should be copied to input value and set as label", ({component,$input,$label}) => {
    const hexCode = component.getAttribute("hex-code")
    const value = $input.value

    assertEqual(hexCode, value,"input's value should be set to the component's hex-code")

    const $code = $label.querySelector("code")
    assert($code,`Expected a <code> inside the label: ${$label.outerHTML}`)
    assertEqual($code.textContent,hexCode,"<code> should have textContent set to the hex code")
  })
  test("when input is changed, the hex-code attribute is updated, as is the label", ({component,$input,$label}) => {
    const value = "#123456"
    $input.value = value
    $input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

    const hexCode = component.getAttribute("hex-code")
    assertEqual(value,hexCode,"component's hex-code attribute should be set to input's value")
    const $code = $label.querySelector("code")
    assert($code,`Expected a <code> inside the label: ${$label.outerHTML}`)
    assertEqual($code.textContent,value,"<code> should have textContent set to the input's label")
  })
})

testCase("non-input-case", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( ({clone,require}) => {
    const component = clone(subject.children[0],"children[0]")
    const $color = require(component.querySelector("[data-color]"),"data-color")
    const $hexcode = require(component.querySelector("[data-hexcode]"),"data-hexcode")

    document.body.appendChild(component)
    return {component,$color,$hexcode}
  })
  teardown( ({component}) => {
    document.body.removeChild(component)
  })
  test("hex-code attribute should be copied to [data-color] background color and set as label", ({component,$color,$hexcode}) => {
    const hexCode = component.getAttribute("hex-code")
    const value = $color.style.backgroundColor
    const [_,r,g,b] = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)

    assert(!!_,`Expected style property to be rgb(r,g,b) but was '${value}'`)
    const valueAsHex = Color.fromRGB(r,g,b).hexCode()

    assertEqual(hexCode, valueAsHex,"[data-color]'s backgroundColor should be set to the component's hex-code")

    const $code = $hexcode.querySelector("code")
    assert($code,`Expected a <code> inside the label: ${$hexcode.outerHTML}`)
    assertEqual($code.textContent,hexCode,"<code> should have textContent set to the hex code")
  })
})

testCase("multiple", ({setup,teardown,test,subject,assert,assertEqual,assertNotEqual}) => {
  setup( () => {
    const component = subject.children[0].cloneNode(true)
    const $inputs = component.querySelectorAll("input[type=color]")
    const $otherInputs = component.querySelectorAll("input:not([type=color])")
    const $labels = component.querySelectorAll("label")

    if ($inputs.length < 2) { throw "ERROR: Not at least 2 input[type=color]" }
    if ($otherInputs.length < 1) { throw "ERROR: Not at least 1 input not color" }
    if ($labels.length < 2) { throw "ERROR: Not at least 2 label" }

    const otherInputIds = Array.from($otherInputs).map( (element) => element.id )

    document.body.appendChild(component)
    return {
      component,
      $inputs,
      $otherInputs,
      $labels,
      otherInputIds,
    }
  })
  teardown( ({component}) => {
    document.body.removeChild(component)
  })
  test("when one input is changed, it is reflected to all others as well as the hex-code attribute",
    ({component,$inputs,$otherInputs,$labels,otherInputIds}) => {
      const value = "#123456"

      $inputs[0].value = value
      $inputs[0].dispatchEvent(new Event("change", { bubbles: true, cancelable: true }))

      const hexCode = component.getAttribute("hex-code")
      assertEqual(value,hexCode,"the component's hex-code attribute should've been given the input's value")
      $inputs.forEach( (input) => {
        assertEqual(value,input.value,`Input's value should've been the one the user entered: ${input.outerHTML}`)
      })
      $otherInputs.forEach( (input) => {
        assertNotEqual(value,input.value,`Non-color input's value should not have been the user's value: ${input.outerHTML}`)
      })
      $labels.forEach( (label) => {
        const labelForOtherInput = otherInputIds.indexOf(label.htmlFor) != -1
        if (labelForOtherInput) {
          assert(String(label.textContent).indexOf(value) == -1,`labels for non-color inputs should not be changed: ${label.htmlFor}`)
        }
        else {
          const $code = label.querySelector("code")
          assert($code,"No <code> inside the label")
          assertEqual(value,$code.textContent,"Label's <code> should have been given the value")
        }
      })
    }
  )
  test("the hex-code attribute will apply to all color inputs and related labels",
    ({component,$inputs,$otherInputs,$labels,otherInputIds}) => {
      const hexCode = component.getAttribute("hex-code")
      $inputs.forEach( (input) => {
        assertEqual(hexCode,input.value,"Color input's value should've been set to the hex-code")
      })
      $otherInputs.forEach( (input) => {
        assertNotEqual(hexCode,input.value,"Non-color input's value should not have been set to the hex-code")
      })
      $labels.forEach( (label) => {
        const labelForOtherInput = otherInputIds.indexOf(label.htmlFor) != -1
        if (labelForOtherInput) {
          assert(String(label.textContent).indexOf(hexCode) == -1,`Other input's label should not contain the hex code ${label.outerHTML}`)
        }
        else {
          const $code = label.querySelector("code")
          assert($code,"label should have a <code> element")
          assertEqual(hexCode,$code.textContent,"<code> element should have the hex code")
        }
      })
    }
  )
})
