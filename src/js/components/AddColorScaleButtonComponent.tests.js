import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
} from "../brutaldom/testing"

const basicSetup = ({require,subject,clone}) => {
  const $component = clone(subject.children[0],"first child")
  const $button = require($component.querySelector("button"))
  const $palette = clone(subject.children[1],"second child")

  $palette.id = `test-case-${$palette.id}`
  $component.setAttribute("palette", $palette.id)
  $palette.querySelectorAll("g-color-swatch").forEach( (swatch) => {
    if (swatch.id) {
      swatch.id = `${palette.id}-${swatch.id}`
    }
  })
  $palette.querySelectorAll("g-color-name").forEach( (colorName) => {
    const colorSwatchId = colorName.getAttribute("color-swatch")
    if (colorSwatchId) {
      colorName.setAttribute("color-swatch",`${palette.id}-${colorSwatchId}`)
    }
  })

  document.body.appendChild($palette)
  document.body.appendChild($component)

  return { $component, $button, $palette }
}

const basicTeardown = ({$component, $palette}) => {
  document.body.removeChild($component)
  document.body.removeChild($palette)
}

const assertNewScale = (newScale,{ linkedToPrimary }) => {
  assert(newScale.baseColorSwatch.id,"Base color swatch must have an id")
  assertEqual(1,document.querySelectorAll(`[id=${newScale.baseColorSwatch.id}]`).length,`Base color swatch's ID ${newScale.baseColorSwatch.id} must be unique`)

  if (linkedToPrimary) {
    assertEqual(linkedToPrimary,newScale.getAttribute("linked-to-primary"),`New scale should be linked to primary as ${linkedToPrimary}`)
    const numInputs = newScale.baseColorSwatch.querySelectorAll("input[type=color]").length
    const numDisabledInputs = newScale.baseColorSwatch.querySelectorAll("input[type=color][disabled]").length
    assertEqual(numInputs,numDisabledInputs,"When linking, any inputs on the base color should be disabled")
  }
  else {
    assert(!newScale.getAttribute("linked-to-primary"),"New scale should not be linked to primary")
  }
  assertEqual("exponential",newScale.getAttribute("scale-algorithm"),"New scale should use the primariy's algorithm")

  const colorName = newScale.querySelector("g-color-name")

  assertEqual(newScale.baseColorSwatch.id,
              colorName.getAttribute("color-swatch"),
              "Color name component should be linked to this new scale's base swatch")

  newScale.swatches.forEach( (swatch) => {
    if (swatch != newScale.baseColorSwatch) {
      assertEqual(swatch.getAttribute("derived-from"),newScale.baseColorSwatch.id,"New swatches should be derived from the base")
      assertEqual(swatch.getAttribute("derivation-algorithm"),"brightness","New swatches should be derived vai brightness")
    }
  })
}

testCase("add-color-scale-random", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(basicSetup)
  teardown(basicTeardown)

  test("clicking the button adds a random color to the palette",
    ({$button,$palette}) => {
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))

      const scales = $palette.querySelectorAll("g-palette-color-scale")
      assertEqual(3,scales.length)

      const newScale = scales[2]
      assertNewScale(scales[2], { linkedToPrimary: false })

    }
  )
  test("clicking the button twice adds two random colors to the palette",
    ({$button,$palette}) => {
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))

      const scales = $palette.querySelectorAll("g-palette-color-scale")
      assertEqual(4,scales.length)

      const newScale1 = scales[2]
      const newScale2 = scales[3]
      assertNewScale(scales[2], { linkedToPrimary: false })
      assertNewScale(scales[3], { linkedToPrimary: false })
    }
  )
})

testCase("add-color-scale-complement", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(basicSetup)
  teardown(basicTeardown)

  test("clicking the button adds a new scale linked as a complement to the primary",
    ({$button,$palette}) => {
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))

      const scales = $palette.querySelectorAll("g-palette-color-scale")
      assertEqual(2,scales.length)

      assertNewScale(scales[1], { linkedToPrimary: "complement" })
    }
  )

  test("clicking the button twice doesn't add a second scale linked as a complement to the primary",
    ({$button,$palette}) => {
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))
      $button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))

      const scales = $palette.querySelectorAll("g-palette-color-scale")
      assertEqual(2,scales.length)

      assertNewScale(scales[1], { linkedToPrimary: "complement" })
    }
  )
})

const algorithms = [
  "split-complement",
  "analogous",
  "triad",
]

algorithms.forEach( (algorithm) => {
  testCase(`add-color-scale-${algorithm}`, ({setup,teardown,test,subject,assert,assertEqual}) => {
    setup(basicSetup)
    teardown(basicTeardown)

    test(`clicking the button adds two new scales linked as ${algorithm}-upper and ${algorithm}-lower to the primary`,
      ({$button,$palette}) => {
        $button.dispatchEvent(new Event(`click`, { cancelable: true, bubbles: true }))

        const scales = $palette.querySelectorAll(`g-palette-color-scale`)
        assertEqual(3,scales.length)

        assertNewScale(scales[1], { linkedToPrimary: `${algorithm}-lower` })
        assertNewScale(scales[2], { linkedToPrimary: `${algorithm}-upper` })
      }
    )

    test(`clicking the button twice doesn't add second scales`,
      ({$button,$palette}) => {
        $button.dispatchEvent(new Event(`click`, { cancelable: true, bubbles: true }))
        $button.dispatchEvent(new Event(`click`, { cancelable: true, bubbles: true }))

        const scales = $palette.querySelectorAll(`g-palette-color-scale`)
        assertEqual(3,scales.length)

        assertNewScale(scales[1], { linkedToPrimary: `${algorithm}-lower` })
        assertNewScale(scales[2], { linkedToPrimary: `${algorithm}-upper` })
      }
    )

    test(`if there is already a lower, it will only add the upper`,
      ({$button,$palette}) => {
        $button.dispatchEvent(new Event(`click`, { cancelable: true, bubbles: true }))

        let scales = $palette.querySelectorAll(`g-palette-color-scale`)
        assertEqual(3,scales.length)

        scales[2].removeAttribute(`linked-to-primary`)
        $button.dispatchEvent(new Event(`click`, { cancelable: true, bubbles: true }))

        scales = $palette.querySelectorAll(`g-palette-color-scale`)
        assertEqual(4,scales.length)

        assertNewScale(scales[1], { linkedToPrimary: `${algorithm}-lower` })
        assertNewScale(scales[2], { linkedToPrimary: false })
        assertNewScale(scales[3], { linkedToPrimary: `${algorithm}-upper` })
      }
    )
  })
})
