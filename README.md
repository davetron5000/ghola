# ghola - Color Picker for Developers

This allows choosing a color palette taht will provide a wide variety of shades and tints, but not too many, and such that most
combinations are accessible.

## How it works

A palette is generated according to constraints provided by the user.  The palette is defined by some number of colors by some
number of shades/tints.

The number of colors can be either 6 or 12 + gray

* Six Colors are: Red, Orange, Yellow, Green, Blue, Purple
* 12 Colors are: Red, Vermilion, Orange, Gold, Yellow, Chartreuse, Green, Cyan, Blue, Indigo, Purple, and Magenta

From a single color, the others can be generated based on the color wheel.
From there, each shade can be generated.

Constraints:
* Darkest shade and lightest shade must have accessible contrast
* Second darkest/lightest must have accessible contrast with black and white
* Each shade should be "about as bright" as the other colors

## Algo

### Six Colors
* Red - 330-30
* Orange - 30-90
* Yellow - 90-150
* Green - 150-210
* Blue - 210-270
* Purple - 270-330

### Twelve Colors

* Red - 330-0
* Vermilion 0-30
* Orange - 30-60
* Gold - 60-90
* Yellow - 90-120
* Chartreuse 120-150
* Green - 150-180
* Cyan - 180-210
* Blue - 210-240
* Indigo - 240-270
* Purple - 270-300
* Magenta - 300-330

### Deriving Other Colors

* Colors can be derived by choosing the equal color of each other one, e.g. if we chose Orange@30 from Six Colors, all the other
five would be 10 above their minimum
  - Can use "rectangle" to choose four, then derive the rest
* Colors could be adjusted via lab-based brightness
* Once the colors are chosen, tints are created to satisfy the contrast requirements

### Building It

1. Color Generator, i.e. take one or more colors and generate the rest - no rectangle, no brightness
2. Add rectangle
3. Add brightness
4. Generate shades

#### Color Generator

Color - HSL internally
    - category - r/g/b/y/ etc
    - name - from that library
    - RGB - for display

ColorWheel


