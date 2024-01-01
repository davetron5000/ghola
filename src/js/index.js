import HexCodeComponent              from "./components/HexCodeComponent"
import EditableColorSwatchComponent  from "./components/EditableColorSwatchComponent"
import ColorNameComponent            from "./components/ColorNameComponent"
import ColorScaleComponent           from "./components/ColorScaleComponent"
import ButtonAccentEnhancement       from "./components/enhancements/ButtonAccentEnhancement"
import ColorInPaletteComponent       from "./components/ColorInPaletteComponent"
import PaletteComponent              from "./components/PaletteComponent"
import ColorNameInputComponent       from "./components/ColorNameInputComponent"

document.addEventListener("DOMContentLoaded", () => {
  HexCodeComponent.define()
  EditableColorSwatchComponent.define()
  ColorNameComponent.define()
  ColorScaleComponent.define()
  ButtonAccentEnhancement.define()
  ColorInPaletteComponent.define()
  ColorNameInputComponent.define()
  PaletteComponent.define()

})
const observer = new PerformanceObserver( (list,observer) => {
  list.getEntries().forEach((entry) => {
    if ( (entry.entryType === "measure") && entry.detail.inspect) {
      if (entry.duration > 10) {
      console.log(`${entry.name}'s duration: ${entry.duration}. Details: %o`,entry.detail);
      }
    }
  })
})
observer.observe({ entryTypes: ["measure", "mark" ] })
