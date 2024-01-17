import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
} from "../brutaldom/testing"

const basicSetup = ({require,clone,subject}) => {

  const $palette = clone(subject.children[0],"first child")

  const $primary  = require($palette.children[0],"first child of palette")
  const $linked   = require($palette.children[1],"second child of palette")
  const $unlinked = require($palette.children[2],"third child of palette")

  $palette.id                  = `test-case-${$palette.id}`
  $primary.baseColorSwatch.id  = `test-case-${$primary.baseColorSwatch.id}`
  $linked.baseColorSwatch.id   = `test-case-${$linked.baseColorSwatch.id}`
  $unlinked.baseColorSwatch.id = `test-case-${$unlinked.baseColorSwatch.id}`

  $primary.querySelector("g-color-name").setAttribute("color-swatch",$primary.baseColorSwatch.id)
  $linked.querySelector("g-color-name").setAttribute("color-swatch",$linked.baseColorSwatch.id)
  $unlinked.querySelector("g-color-name").setAttribute("color-swatch",$unlinked.baseColorSwatch.id)

  document.body.appendChild($palette)

  return { $palette, $primary, $linked, $unlinked }
}

const basicTeardown = ({$palette}) => {
  document.body.removeChild($palette)
}

testCase("palette-events", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(basicSetup)
  teardown(basicTeardown)

  test("changing primary color sends a palette-change event",
    ({$palette,$primary}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })
      const input = $primary.querySelector("input[type=color]")
      input.value = "#991234"
      input.dispatchEvent(new Event("change", { cancelable: true, bubbles: true }))
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )
  test("changing unlinked color sends a palette-change event",
    ({$palette,$unlinked}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })
      const input = $unlinked.querySelector("input[type=color]")
      input.value = "#991234"
      input.dispatchEvent(new Event("change", { cancelable: true, bubbles: true }))
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )
  test("adding a linked color sends a palette-change event",
    ({$palette}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })
      $palette.addScale({linkAlgorithm: "split-complement-upper"})
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )
  test("adding an unlinked color sends a palette-change event",
    ({$palette}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })
      $palette.addScale({hexCode: "#998812"})
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )
  test("removing a color sends a palette-change event",
    ({$palette}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })

      const button = $palette.querySelectorAll("button[data-remove]")[1]
      button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )
  test("unlinking a color sends a palette-change event",
    ({$palette}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })

      const button = $palette.querySelectorAll("button[data-unlink]")[1]
      button.dispatchEvent(new Event("click", { cancelable: true, bubbles: true }))
      assert(receivedEvent,"Expected the palette-change event to have been triggered")
    }
  )

  test("renaming a color sends a palette-change",
    ({$palette}) => {
      let receivedEvent
      $palette.addEventListener("palette-change", (event) => {
        receivedEvent = event
      })

      const colorNameInputs = $palette.querySelectorAll("g-color-name input")
      const randomIndex = Math.floor(Math.random() * colorNameInputs.length)
      const input = colorNameInputs[randomIndex]

      input.value = "Bleorgh"
      input.dispatchEvent(new Event("change", { cancelable: true, bubbles: true }))
      assert(receivedEvent,`Expected the palette-change event to have been triggered from ${randomIndex}`)
    }
  )

  test("the palette's primary color info can be accessed when a name is not overridden",
    ({$palette}) => {
      assertEqual("#600080",$palette.primaryColor.hexCode)
      assertEqual("Purple",$palette.primaryColor.colorName)
      assert(!$palette.primaryColor.colorNameUserOverride)
    }
  )

  test("the palette's primary color info can be accessed when a name is overridden",
    ({$palette}) => {
      $palette.querySelector("g-color-name").overrideColorName("Foo")
      assertEqual("#600080",$palette.primaryColor.hexCode)
      assertEqual("Foo",$palette.primaryColor.colorName)
      assert($palette.primaryColor.colorNameUserOverride)
    }
  )
  test("the palette's non-primary colors' info can be accessed when a name is not overridden",
    ({$palette}) => {
      const otherColors = $palette.otherColors
      assertEqual(2,otherColors.length,"There should be two other colors")

      assertEqual("complement",otherColors[0].algorithm)
      assertEqual("Green",otherColors[0].colorName)
      assert(!otherColors[0].colorNameUserOverride,"color name should not be overridden")

      assertEqual("#881123",otherColors[1].hexCode)
      assertEqual("Red",otherColors[1].colorName)
      assert(!otherColors[1].colorNameUserOverride,"color name should not be overridden")
    }
  )

  test("the palette's non-primary colors' info can be accessed when a name is overridden",
    ({$palette}) => {
      $palette.querySelectorAll("g-color-name").forEach( (element,index) => {
        element.overrideColorName(`Foo ${index}`)
      })
      const otherColors = $palette.otherColors
      assertEqual(2,otherColors.length,"There should be two other colors")

      assertEqual("complement",otherColors[0].algorithm)
      assertEqual("Foo 1",otherColors[0].colorName)
      assert(otherColors[0].colorNameUserOverride,"color name should be overridden")

      assertEqual("#881123",otherColors[1].hexCode)
      assertEqual("Foo 2",otherColors[1].colorName)
      assert(otherColors[1].colorNameUserOverride,"color name should be overridden")
    }
  )

})
