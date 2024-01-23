# ghola - color palette generator for devs

Ghola helps you make a usable palette quickly that is good, not great. Fine, not amazing.  But something you can get to work with
quickly.

[Here's a great palette for you!](https://ghola.dev/?primaryColor=%235b1275&otherColors=triad-lower%2Ctriad-upper%2C%23b10a0c%2C%23131378%2C%23898492%3AGray%2C%23d95000)

This is built with Web Components and a bunch of solid, stable tech that does not include: JavaScript Framework, Horrible Testing
Solution, User-Punishing Client-Side Rendering By Default, CSS-in-JS, JS-in-CSS, NodeJS, Glorp, Gurp, Gump, or the Gulp build
tools.

You get: `make`, EJS, bash, Docker, and [MelangeCSS](https://melangecss.com).

## Setup

1. Clone this repo
2. Install Docker
3. `dx/build`
4. `dx/start`
5. In another window:
   1. `dx/exec bin/setup`
   2. `dx/exec bin/dev`
6. Open `http://localhost:5555` in your browser
