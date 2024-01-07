# ghola - color palette generator for devs

## Features

* Link derived colors e.g. the complement
  - These cannot be changed
  - they are labeled as such
* Name the colors - default based on previous ghola, but allow to change
* Download CSS


## Web Components

* Everything is text based
* Communication via setting attributes?
* How to know when to re-draw the component?
* How to understand performance?


* Actions:
  - user changes primary color in scale
    - Current scale recalc
    - derived scales recalc
    - save palette to push state
    - save palette to url params
  - User adds a derived color
    - add new scale(s)
    - update the push state
    - update the url params
  - User adds a random color
    - add new scale
    - update the push state
    - update the url params
  - user removes a color
    - remove the scale
    - update the push state
    - update the url params
  - page reloads
    - fetch palette from url params
    - create all needed scales
  - user does a back or forward
    - fetch palette from push state
    - ??? this is expensive - I think it blows away everything
      - ideally update existing

What is a palette?
  - ordered list of colors
  - color is one of:
    - hex + optional user defined name
    - derivation algorithm + reference to color in palette derived from

<g-palette>
  <div>
      <g-color type="user" hex="123456" id="123456">
      <!--
      editableSwatch.onColorChanged( (event) => {
              this.fireColorChanged()
              this.swatches.hex = event.detail
      })
      -->
        <h3>Color Name</h3>
        <g-color-swatch hex="123456">
          <input type=color>
          <label>
            #123456
          </label>
        </g-color-swatch>
        <g-color-swatch hex="12345" darken="59%"></g-color-swatch>
        <g-color-swatch editable></g-color-swatch>
        <g-color-swatch></g-color-swatch>
        <g-color-swatch></g-color-swatch>
      </g-color>
      <button>Add Complement</button>
  </div>
  <g-color type="derived" algorithm="split-component-1" derived-from-id="123456">
  <!-- 
    colorElement.onColorChanged( (event) => self.derive(event.detail) )
  -->
    <g-color-swatch></g-color-swatch>
    <g-color-swatch></g-color-swatch>
    <g-color-swatch></g-color-swatch>
    <g-color-swatch></g-color-swatch>
    <g-color-swatch></g-color-swatch>
  </g-color>
</g-palette>




## Setup

1. Clone this repo
2. Install Docker
3. `dx/build`
4. `dx/start`
5. In another window:
   1. `dx/exec bin/setup`
   2. `dx/exec bin/dev`
6. Open `http://localhost:5555` in your browser
