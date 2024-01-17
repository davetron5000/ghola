import {
  test,
  assertEqual,
  assertNotEqual,
  assert,
  testCase,
} from "../brutaldom/testing"

const basicSetup = (locatePaletteColor) => {
  return ({subject,require,clone}) => {
    const $paletteColor  = locatePaletteColor({subject,require,clone})
    const $previewButton = require($paletteColor.querySelector("[data-preview]"),"[data-preview] button")
    const $unlinkButton  = require($paletteColor.querySelector("[data-unlink]"),"[data-unlink] button")
    const $removeButton  = require($paletteColor.querySelector("[data-remove]"),"[data-remove] button")

    /* Given we have cloned the entire thing:
     * 1 - we have to change any relevant ids
     * 2 - we have to clear any attributes the component may have set before the clone
     */

    // ID to set in ourselves
    const uniqueId = `palette-color-scale-${crypto.randomUUID()}`
    $paletteColor.id = `test-case-${uniqueId}`

    const container = document.createElement("div")
    container.appendChild($paletteColor)

    document.body.appendChild(container)

    $paletteColor.querySelectorAll("g-color-swatch").forEach( (e) => {
      // If we have an id, don't clear it, but change it to be unique
      if (e.id) {
        e.id = `test-case-${e.id}`
      }
      // Remove these attributes as the component will set them
      e.removeAttribute("derived-from")
      e.removeAttribute("darken-by")
      e.removeAttribute("brighten-by")
    })
    // Remove this so we can set it later to trigger needed behavior
    $paletteColor.removeAttribute("scale-algorithm")

    return {
      container,
      $paletteColor,
      $previewButton,
      $unlinkButton,
      $removeButton,
    }
  }
}

const setupBasedOnFirstChild = basicSetup( ({subject,clone}) => clone(subject.children[0],"children[0]") )

const teardownAdded = ({container}) => {
  try {
    document.body.removeChild(container)
  }
  catch (e) {
    if ( (e instanceof DOMException) && e.name == "NotFoundError") {
      console.debug("Ignoring %o",e)
    }
    else {
      throw e
    }
  }
}

testCase("primary-color", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(setupBasedOnFirstChild)
  teardown(teardownAdded)

  test("preview is enabled, but unlink and remove are not",
    ({ $previewButton, $unlinkButton, $removeButton }) => {

      assert(!$previewButton.getAttribute("disabled"), "Expected preview button to be enabled")
      assert( $unlinkButton.getAttribute("disabled"), "Expected unlink button to be disabled")
      assert( $removeButton.getAttribute("disabled"), "Expected remove button to be disabled")
    }
  )

  test("Relevant data is exposed: current color, user override, scale, and base swatch",
    ({ $paletteColor }) => {

      $paletteColor.setAttribute("scale-algorithm", "linear")

      assertEqual("Purple",$paletteColor.colorName, "Color name should reflect the value in the color name field")
      assert(!$paletteColor.colorNameUserOverride, "Color name is not user defined when using the default")
      assertEqual("#140826",$paletteColor.colorScale[0].toUpperCase(),"The first color in the scale when using exp should be the darkest")
      assertEqual("#28104C",$paletteColor.colorScale[1].toUpperCase(),"The second color in the scale when using exp should be the darker")
      assertEqual("#3C1971",$paletteColor.colorScale[2].toUpperCase(),"The third color in the scale when using exp should be the dark")
      assertEqual("#6429BD",$paletteColor.colorScale[3].toUpperCase(),"The fourth color in the scale when using exp should be the base")
      assertEqual("#905EDC",$paletteColor.colorScale[4].toUpperCase(),"The fifth color in the scale when using exp should be the bright")
      assertEqual("#C0A3EB",$paletteColor.colorScale[5].toUpperCase(),"The sixth color in the scale when using exp should be the brighter")
      assertEqual("#EFE8FA",$paletteColor.colorScale[6].toUpperCase(),"The seventh color in the scale when using exp should be the brightest")
      assertEqual($paletteColor.querySelectorAll("g-color-swatch")[3],$paletteColor.baseColorSwatch,"Base color swatch should be the middle one")
    }
  )
  test("values are derived based on a linear percentage",
    ({ $paletteColor }) => {

      $paletteColor.setAttribute("scale-algorithm", "linear")

      const swatches = Array.from($paletteColor.querySelectorAll("g-color-swatch"))

      const base = swatches[3]

      swatches.forEach( (swatch,index) => {
        if (index == 3) {
          return;
        }
        assertEqual(base.id,swatch.getAttribute("derived-from"),`Swatch ${index} should be derived-from the base (${base.id})`)
        assertEqual("brightness",swatch.getAttribute("derivation-algorithm","brightness"), `Swatch ${index} should use the brightness algorithm`)
      })

      assertEqual("80%",swatches[0].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("60%",swatches[1].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("40%",swatches[2].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("30%",swatches[4].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual("60%",swatches[5].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual("90%",swatches[6].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual($paletteColor.querySelectorAll("g-color-swatch")[3],$paletteColor.baseColorSwatch,"The base swatch should be the middle one")
    }
  )

  test("The preview event is fired when the preview button is clicked and includes the relevant info",
    ({$paletteColor,$previewButton}) => {
      let previewCalled = false
      let detail = null

      $paletteColor.addEventListener("preview-scale", (event) => {
        previewCalled = true 
        detail = event.detail
      })
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
      assertEqual($paletteColor.colorName,detail.colorName, "details should have the color name")
      assertEqual($paletteColor.colorNameUserOverride,detail.colorNameUserOverride,"details should have the override flag")
      assert(7,detail.colorScale.length,"details should have the same # of colors in the scale")
      $paletteColor.colorScale.forEach( (hexCode,index) => {
        assertEqual(hexCode,detail.colorScale[index],`Index ${index} should match the component`)
      })
      assertEqual($paletteColor.baseColorSwatch.hexCode,detail.baseColor,"Base color should be explicitly called out")

    }
  )
})

testCase("derive-color-scale-exp", ({setup,teardown,confidenceCheck,test,subject,assert,assertEqual}) => {
  setup(setupBasedOnFirstChild)
  teardown(teardownAdded)
  confidenceCheck( ({$paletteColor}) => {
    const numSwatches = $paletteColor.querySelectorAll("g-color-swatch").length
    if (numSwatches != 7) {
      throw `Test setup is borked - there are ${numSwatches} swatches and not 5`
    }
  })

  test("derivations and configuration are set automatically on swatches based on an exponential progression",
    ({ $paletteColor }) => {
      const swatches = Array.from($paletteColor.querySelectorAll("g-color-swatch"))

      const base = swatches[3]


      // Trigger everything
      $paletteColor.setAttribute("scale-algorithm","exponential")

      assert(base.id,`Base swatch should have been given an ID: ${base.outerHTML}`)
      assertEqual(1,document.querySelectorAll(`#${base.id}`).length,"The assigned ID should be unique")

      swatches.forEach( (swatch,index) => {
        if (index == 3) {
          return;
        }
        assertEqual(base.id,swatch.getAttribute("derived-from"),`Swatch ${index} should be derived-from the base (${base.id})`)
        assertEqual("brightness",swatch.getAttribute("derivation-algorithm","brightness"), `Swatch ${index} should use the brightness algorithm`)
      })

      assertEqual("88%",swatches[0].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("64%",swatches[1].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("35%",swatches[2].getAttribute("darken-by"), "Swatches earlier in scale should have darker colors")
      assertEqual("49%",swatches[4].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual("87%",swatches[5].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual("96%",swatches[6].getAttribute("brighten-by"), "Swatches later in scale should have brighter colors")
      assertEqual($paletteColor.querySelectorAll("g-color-swatch")[3],$paletteColor.baseColorSwatch,"The base swatch should be the middle one")
    }
  )
})

testCase("linked-to-primary", ({setup,teardown,test,confidenceCheck,subject,assert,assertEqual}) => {
  setup( (...args) => {
    const locatePaletteColor = ({subject,clone}) => {
      return clone(subject.querySelector("g-palette-color-scale[linked-to-primary]"),"g-palette-color-scale[linked-to-primary]",subject)
    }
    return basicSetup(locatePaletteColor)(...args)
  })
  setup( ({subject,container,clone,$paletteColor}) => {
    const $primary = clone(subject.querySelector("g-palette-color-scale[primary]"))
    $primary.id = `test-case-primary-${crypto.randomUUID()}`
    container.appendChild($primary)
    // Force the relinking behavior
    $paletteColor.removeAttribute("linked-to-primary")
    $paletteColor.setAttribute("linked-to-primary","complement")
    return {$primary}
  })
  confidenceCheck(({$primary,$paletteColor}) => {
    assert($primary.baseColorSwatch,"the linked-to-primary g-color-scale should've had a baseColorSwatch")
    assert($paletteColor.baseColorSwatch.querySelectorAll("input[type=color]").length > 0,"there should be at least one color input on our base color")
  })

  teardown(teardownAdded)

  test("the base color is linked to the primary using the value for linked-to-primary",
    ({ $paletteColor,$primary }) => {
      assertEqual($primary.baseColorSwatch.id,$paletteColor.baseColorSwatch.getAttribute("derived-from"),`Expected our base color's derived-from to have been set to the primary's base color: primary ${$primary.baseColorSwatch.outerHTML}\nus: ${$paletteColor.baseColorSwatch.outerHTML}`)
      assertEqual($paletteColor.getAttribute("linked-to-primary"),$paletteColor.baseColorSwatch.getAttribute("derivation-algorithm"))
    }
  )

  test("all buttons are enabled",
    ({ $paletteColor, $previewButton, $unlinkButton, $removeButton }) => {

      assert(!$previewButton.getAttribute("disabled"), "Expected preview button to be enabled")
      assert(!$unlinkButton.getAttribute("disabled"), "Expected unlink button to be enabled")
      assert(!$removeButton.getAttribute("disabled"), "Expected remove button to be enabled")
    }
  )

  test("The preview event is fired when the preview button is clicked",
    ({$paletteColor,$previewButton}) => {
      let previewCalled = false
      $paletteColor.addEventListener("preview-scale", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
  test("The remove event is fired after the element is removed, when the remove button is clicked",
    ({$paletteColor,$removeButton}) => {
      let eventReceived = false
      let childExists = null
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove-scale", (event) => {
        eventReceived = true 
        childExists = !!parent.children.namedItem(id)
      })
      $removeButton.dispatchEvent(new Event("click"))

      assert(eventReceived,"The event listener should've been called when the button was clicked")
      assert(!childExists,"Removal should've been called before the event handler")
      assert(!parent.children.namedItem(id),"The element should've been removed")
    }
  )
  test("The unlink event is fired when unlink is clicked and the derivation attributes from the base swatch are removed, but it's hex-code is preserved and any inputs inside are made editable",
    ({$paletteColor,$unlinkButton,$primary}) => {
      let eventReceived = null
      let stillLinkedToPrimary = null
      $paletteColor.addEventListener("unlink-from-primary", (event) => {
        eventReceived = true
        stillLinkedToPrimary = $paletteColor.getAttributeNames().indexOf("linked-to-primary") != -1
      })
      $unlinkButton.dispatchEvent(new Event("click"))

      assert(eventReceived,"The event listener should've been called when the button was clicked")
      assert(!stillLinkedToPrimary,"Unlinking should've occured before the handler was called")
      assert($paletteColor.getAttributeNames().indexOf("linked-to-primary") == -1,"linked-to-primary attribute should've been removed")
      assert($paletteColor.baseColorSwatch.getAttributeNames().indexOf("derived-from") == -1,"derived-from should've been removed")
      assert($paletteColor.baseColorSwatch.getAttributeNames().indexOf("derivation-algorithm") == -1,"derivation-algorithm should've been removed")
      assertEqual("#82BD29",$paletteColor.baseColorSwatch.getAttribute("hex-code"),"hex-code shoud've been set on the base color")
      $paletteColor.baseColorSwatch.querySelectorAll("input[type=color]").forEach( (input) => {
        assert(input.getAttributeNames().indexOf("disabled") == -1,`Input should not have disabled set: ${input.outerHTML}`)
      })

      $primary.baseColorSwatch.querySelector("input[type=color]").value = "#111111"
      $primary.baseColorSwatch.querySelector("input[type=color]").dispatchEvent(new Event("change"))
      assertEqual("#82BD29",$paletteColor.baseColorSwatch.getAttribute("hex-code"),"hex-code shoud've been set on the base color")
      assertEqual("#82bd29",$paletteColor.baseColorSwatch.querySelector("input[type=color]").value,"input value shoud've been set on the base color")
    }
  )
})

testCase("unlinked-color", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(setupBasedOnFirstChild)
  teardown(teardownAdded)

  test("preview and remove are enabled, but unlink id not",
    ({ $paletteColor, $previewButton, $unlinkButton, $removeButton }) => {

      assert(!$previewButton.getAttribute("disabled"), "Expected preview button to be enabled")
      assert( $unlinkButton.getAttribute("disabled"), "Expected unlink button to be disabled")
      assert(!$removeButton.getAttribute("disabled"), "Expected remove button to be enabled")
    }
  )

  test("The preview event is fired when the preview button is clicked",
    ({$paletteColor,$previewButton}) => {
      let previewCalled = false
      $paletteColor.addEventListener("preview-scale", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
  test("The remove event is fired and the element is removed when the remove button is clicked",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id
      $paletteColor.addEventListener("remove-scale", (event) => removeCalled = true )
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(!parent.children.namedItem(id),"The element should've been removed")
    }
  )
})

testCase("color-changed-event", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(setupBasedOnFirstChild)
  teardown(teardownAdded)

  test("when the base color is changed, an event id fired",
    ({ $paletteColor }) => {
      let receivedEvent = null
      $paletteColor.addEventListener("base-color-changed", (event) => {
        receivedEvent = event
      })

      $paletteColor.baseColorSwatch.forTesting.dispatchHexCodeChanged()

      assert(receivedEvent,"Event should've been fired")
      assert(receivedEvent.bubbles,"Event should bubble")

    }
  )
})
