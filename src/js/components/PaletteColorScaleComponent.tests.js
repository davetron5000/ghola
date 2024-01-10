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

    const uniqueId = `palette-color-scale-${crypto.randomUUID()}`
    $paletteColor.querySelectorAll("g-color-swatch").forEach( (swatch) => {
      if (swatch.getAttribute("derived-from")) {
        swatch.setAttribute("derived-from",uniqueId)
      }
      if (swatch.getAttribute("id") && swatch.getAttribute("hex-code")) {
        swatch.id = uniqueId
      }
    })
    $paletteColor.querySelectorAll("g-color-name").forEach( (colorName) => {
      if (colorName.getAttribute("color-swatch")) {
        colorName.setAttribute("color-swatch",uniqueId)
      }
    })
    $paletteColor.id = `test-case-${uniqueId}`

    document.body.appendChild($paletteColor)

    return {
      $paletteColor,
      $previewButton,
      $unlinkButton,
      $removeButton,
    }
  }
}

const childrenSetup = basicSetup( ({subject,clone}) => clone(subject.children[0],"children[0]") )

const teardownAdded = ({$paletteColor}) => {
  try {
    document.body.removeChild($paletteColor)
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
  setup(childrenSetup)
  teardown(teardownAdded)

  test("preview is enabled, but unlink and remove are not",
    ({ $paletteColor, $previewButton, $unlinkButton, $removeButton }) => {

      assert(!$previewButton.getAttribute("disabled"), "Expected preview button to be enabled")
      assert( $unlinkButton.getAttribute("disabled"), "Expected unlink button to be disabled")
      assert( $removeButton.getAttribute("disabled"), "Expected remove button to be disabled")
    }
  )

  test("The current name and colors can be queried",
    ({ $paletteColor }) => {

      assertEqual("Purple",$paletteColor.colorName, "Color name should reflect the value in the color name field")
      assert(!$paletteColor.colorNameUserOverride, "Color name is not user defined when using the default")
      assertEqual("#0a0413",$paletteColor.colorScale[0],"The first color in the scale when using exp should be the darkest")
      assertEqual("#32145f",$paletteColor.colorScale[1],"The first color in the scale when using exp should be the darker")
      assertEqual("#461d84",$paletteColor.colorScale[2],"The first color in the scale when using exp should be the dark")
      assertEqual("#6429bd",$paletteColor.colorScale[3],"The first color in the scale when using exp should be the base")
      assertEqual("#905edc",$paletteColor.colorScale[4],"The first color in the scale when using exp should be the bright")
      assertEqual("#b08ce6",$paletteColor.colorScale[5],"The first color in the scale when using exp should be the brighter")
      assertEqual("#efe8fa",$paletteColor.colorScale[6],"The first color in the scale when using exp should be the brightest")
    }
  )

  test("The preview event is fired when the preview button is clicked",
    ({$paletteColor,$previewButton}) => {
      let previewCalled = false
      $paletteColor.addEventListener("preview", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
})

testCase("derive-color-scale", ({setup,teardown,confidenceCheck,test,subject,assert,assertEqual}) => {
  setup(childrenSetup)
  setup(({$paletteColor}) => {
    // Clear out the ids and any generated attributes
    $paletteColor.querySelectorAll("g-color-swatch").forEach( (e) => {
      e.removeAttribute("id")
      e.removeAttribute("derived-from")
      e.removeAttribute("darken-by")
      e.removeAttribute("brighten-by")
    })
    $paletteColor.removeAttribute("derive-color-scale")
  })
  teardown(teardownAdded)
  confidenceCheck( ({$paletteColor}) => {
    const numSwatches = $paletteColor.querySelectorAll("g-color-swatch").length
    if (numSwatches != 7) {
      throw `Test setup is borked - there are ${numSwatches} swatches and not 5`
    }
  })

  test("derivations and configuration are set automatically on swatches based on a linear progression",
    ({ $paletteColor }) => {
      const swatches = Array.from($paletteColor.querySelectorAll("g-color-swatch"))

      const base = swatches[3]


      // Trigger everything
      $paletteColor.setAttribute("derive-color-scale","linear")

      assert(base.id,`Base swatch should have been given an ID: ${base.outerHTML}`)
      assertEqual(1,document.querySelectorAll(`#${base.id}`).length,"The assigned ID should be unique")

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
})

testCase("derive-color-scale-exp", ({setup,teardown,confidenceCheck,test,subject,assert,assertEqual}) => {
  setup(childrenSetup)
  setup(({$paletteColor}) => {
    // Clear out the ids and any generated attributes
    $paletteColor.querySelectorAll("g-color-swatch").forEach( (e) => {
      e.removeAttribute("id")
      e.removeAttribute("derived-from")
      e.removeAttribute("darken-by")
      e.removeAttribute("brighten-by")
    })
    $paletteColor.removeAttribute("derive-color-scale")
  })
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
      $paletteColor.setAttribute("derive-color-scale","exponential")

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

testCase("linked-color", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( (...args) => {
    const locatePaletteColor = ({subject,clone}) => {
      return clone(subject.querySelector("g-palette-color-scale[linked-to]"),"g-palette-color-scale[linked-to]",subject)
    }
    return basicSetup(locatePaletteColor)(...args)
  })

  teardown(teardownAdded)

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
      $paletteColor.addEventListener("preview", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
  test("The remove event is fired and the element is removed when the remove button is clicked",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove", (event) => removeCalled = true )
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(!parent.children.namedItem(id),"The element should've been removed")
    }
  )
  test("The remove event is fired but the element not removed when the remove button is clicked but the handler preventsDefault()",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove", (event) => {
        event.preventDefault()
        removeCalled = true 
      })
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(parent.children.namedItem(id),"The element should still be there")
    }
  )
  test("The unlink event is fired and the linked-to attribute removed when the unlink button is clicked",
    ({$paletteColor,$unlinkButton}) => {
      let unlinkCalled = false
      $paletteColor.addEventListener("unlink", (event) => unlinkCalled = true )
      $unlinkButton.dispatchEvent(new Event("click"))

      assert(unlinkCalled,"The event listener should've been called when the button was clicked")
      assert($paletteColor.getAttribute("linked-to") === null,"linked-to attribute should've been removed")
    }
  )
  test("The unlink event is fired but the linked-to attribute remains if default is prevented",
    ({$paletteColor,$unlinkButton}) => {
      let unlinkCalled = false
      $paletteColor.addEventListener("unlink", (event) => {
        event.preventDefault()
        unlinkCalled = true 
      })
      $unlinkButton.dispatchEvent(new Event("click"))

      assert(unlinkCalled,"The event listener should've been called when the button was clicked")
      assert($paletteColor.getAttribute("linked-to") !== null,`linked-to attribute should not been removed`)
    }
  )
})
testCase("linked-to-primary", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup( (...args) => {
    const locatePaletteColor = ({subject,clone}) => {
      return clone(subject.querySelector("g-palette-color-scale[linked-to-primary]"),"g-palette-color-scale[linked-to-primary]",subject)
    }
    return basicSetup(locatePaletteColor)(...args)
  })

  teardown(teardownAdded)

  test("preview is enabled, but unlink and remove are not",
    ({ $paletteColor, $previewButton, $unlinkButton, $removeButton }) => {

      assert(!$previewButton.getAttribute("disabled"), "Expected preview button to be enabled")
      assert(!$unlinkButton.getAttribute("disabled"), "Expected unlink button to be enabled")
      assert(!$removeButton.getAttribute("disabled"), "Expected remove button to be enabled")
    }
  )

  test("The preview event is fired when the preview button is clicked",
    ({$paletteColor,$previewButton}) => {
      let previewCalled = false
      $paletteColor.addEventListener("preview", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
  test("The remove event is fired and the element is removed when the remove button is clicked",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove", (event) => removeCalled = true )
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(!parent.children.namedItem(id),"The element should've been removed")
    }
  )
  test("The remove event is fired but the element not removed when the remove button is clicked but the handler preventsDefault()",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove", (event) => {
        event.preventDefault()
        removeCalled = true 
      })
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(parent.children.namedItem(id),"The element should still be there")
    }
  )
  test("The unlink event is fired and the linked-to-primary attribute removed when the unlink button is clicked",
    ({$paletteColor,$unlinkButton}) => {
      let unlinkCalled = false
      $paletteColor.addEventListener("unlink", (event) => unlinkCalled = true )
      $unlinkButton.dispatchEvent(new Event("click"))

      assert(unlinkCalled,"The event listener should've been called when the button was clicked")
      assert($paletteColor.getAttribute("linked-to-primary") === null,"linked-to-primary attribute should've been removed")
    }
  )
  test("The unlink event is fired but the linked-to-primary attribute remains if default is prevented",
    ({$paletteColor,$unlinkButton}) => {
      let unlinkCalled = false
      $paletteColor.addEventListener("unlink", (event) => {
        event.preventDefault()
        unlinkCalled = true 
      })
      $unlinkButton.dispatchEvent(new Event("click"))

      assert(unlinkCalled,"The event listener should've been called when the button was clicked")
      assert($paletteColor.getAttribute("linked-to-primary") !== null,`linked-to-primary attribute should not been removed`)
    }
  )
})

testCase("unlinked-color", ({setup,teardown,test,subject,assert,assertEqual}) => {
  setup(childrenSetup)
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
      $paletteColor.addEventListener("preview", (event) => previewCalled = true )
      $previewButton.dispatchEvent(new Event("click"))

      assert(previewCalled,"The event listener should've been called when the button was clicked")
    }
  )
  test("The remove event is fired and the element is removed when the remove button is clicked",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id
      $paletteColor.addEventListener("remove", (event) => removeCalled = true )
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(!parent.children.namedItem(id),"The element should've been removed")
    }
  )
  test("The remove event is fired but the element not removed when the remove button is clicked but the handler preventsDefault()",
    ({$paletteColor,$removeButton}) => {
      let removeCalled = false
      const parent = $paletteColor.parentElement
      const id = $paletteColor.id

      $paletteColor.addEventListener("remove", (event) => {
        event.preventDefault()
        removeCalled = true 
      })
      $removeButton.dispatchEvent(new Event("click"))

      assert(removeCalled,"The event listener should've been called when the button was clicked")
      assert(parent.children.namedItem(id),"The element should still be there")
    }
  )
})
