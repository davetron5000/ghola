import { Body, LogViewer } from "brutaljs"

import PageState   from "./components/PageState"
import PaletteForm from "./components/PaletteForm"
import Palette     from "./components/Palette"
import ViewForm    from "./components/ViewForm"
import Tooltip     from "./components/Tooltip"

document.addEventListener("DOMContentLoaded", () => {
  /*
  const gholaLogViewer = new LogViewer({ type: "measure", logContext: "ghola", })
  gholaLogViewer.start()
  const eventsLogViewer = new LogViewer({ type: "measure", className: "Template", })
  eventsLogViewer.start()
  */
  const pageState = new PageState(window,{
    numColors: 6,
    colorHex: "#8900C0",
    secondaryColorHex: null,
    numShades: 5,
    scaleModel: "FixedLightness",
    colorWheel: "NuancedHueBased",
    showColorDetails: true,
    showContrastInfo: true,
    bigSwatches: true,
  })

  const body = new Body()

  const palette = new Palette(body.$("palette"))

  const paletteForm = new PaletteForm(body.$selector("form[data-palette-config]"),{
    numColors: pageState.numColors,
    color: pageState.color,
    secondaryColor: pageState.secondaryColor,
    secondaryColorChecked: pageState.isSecondaryColorChecked,
    numShades: pageState.numShades,
    scaleModel: pageState.scaleModel,
    colorWheel: pageState.colorWheel,
  })

  const viewForm = new ViewForm(body.$selector("form[data-view-config]"),{
    showColorDetails: pageState.isShowColorDetails,
    showContrastInfo: pageState.isShowContrastInfo,
    bigSwatches: pageState.isBigSwatches,
  })

  paletteForm.onBaseColorChanged( (color)       => palette.rebuild({baseColor: color}) )
  paletteForm.onSecondaryColorChanged( (color)  => palette.rebuild({secondaryColor: color}) )
  paletteForm.onNumColorsChanged( (numColors)   => palette.rebuild({numColors}) )
  paletteForm.onNumShadesChanged( (numShades)   => palette.rebuild({numShades}) )
  paletteForm.onScaleModelChanged( (scaleModel) => palette.rebuild({scaleModel}) )
  paletteForm.onColorWheelChanged( (colorWheel) => palette.rebuild({colorWheel}) )

  viewForm.onShowColorDetails( () => palette.showDetails() )
  viewForm.onShowContrastInfo( () => palette.showContrast() )
  viewForm.onBigSwatches(      () => palette.swatchSize = "large" )
  viewForm.onHideColorDetails( () => palette.hideDetails() )
  viewForm.onHideContrastInfo( () => palette.hideContrast() )
  viewForm.onNoBigSwatches(    () => palette.swatchSize = "small" )

  paletteForm.onBaseColorChanged( (color)       => pageState.color = color )
  paletteForm.onSecondaryColorChanged( (color)  => pageState.secondaryColor = color )
  paletteForm.onNumColorsChanged( (numColors)   => pageState.numColors = numColors )
  paletteForm.onNumShadesChanged( (numShades)   => pageState.numShades = numShades )
  paletteForm.onScaleModelChanged( (scaleModel) => pageState.scaleModel = scaleModel )
  paletteForm.onColorWheelChanged( (colorWheel) => pageState.colorWheel = colorWheel )

  viewForm.onShowColorDetails( () => pageState.showColorDetails = true )
  viewForm.onShowContrastInfo( () => pageState.showContrastInfo = true )
  viewForm.onBigSwatches(      () => pageState.bigSwatches      = true )
  viewForm.onHideColorDetails( () => pageState.showColorDetails = false )
  viewForm.onHideContrastInfo( () => pageState.showContrastInfo = false )
  viewForm.onNoBigSwatches(    () => pageState.bigSwatches      = false )

  pageState.onPopstate( ({numColors,color,secondaryColor, numShades,scaleModel}) => {
    palette.rebuild({
      numColors: numColors,
      baseColor: color,
      secondaryColor: secondaryColor,
      numShades: numShades,
      scaleModel: scaleModel,
      colorWheel: colorWheel,
    })
  })

  pageState.onPopstate( ({numColors,color,secondaryColor, numShades}) => {
    paletteForm.numColors = numColors
    paletteForm.color = color
    paletteForm.secondaryColor = secondaryColor
    paletteForm.numShades =  numShades
    paletteForm.scaleModel = scaleModel
  })

  palette.rebuild({
    numColors: paletteForm.numColors,
    baseColor: paletteForm.color,
    secondaryColor: paletteForm.secondaryColor,
    numShades: paletteForm.numShades,
    scaleModel: paletteForm.scaleModel,
    colorWheel: paletteForm.colorWheel,
  })

  if (viewForm.showColorDetails) {
    palette.showDetails()
  }
  else {
    palette.hideDetails()
  }
  if (viewForm.showContrastInfo) {
    palette.showContrast()
  }
  else {
    palette.hideContrast()
  }
  if (viewForm.bigSwatches) {
    palette.swatchSize = "large"
  }
  else {
    palette.swatchSize = "small"
  }

  const tooltip = new Tooltip(body.$("tooltip-ui"),body.$selectors("[data-tooltip]"))

})
