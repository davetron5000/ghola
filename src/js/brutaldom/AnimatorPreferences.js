/** Wrapper for preferences regarding animation.
 *
 * @property {Boolean} immediateAlways - if true, animations should always be completed immediately.  This can be set in a few
 * ways:
 * * If the `<document>` has `data-animator-immediate="true"`, then `immediateAlways` is true
 * * If the `<document>` has `data-animator-immediate="false"`, then `immediateAlways` is false
 * * Otherwise, `immediateAlways` is true if the browser has `prefers-reduced-motion`
 */
class AnimatorPreferences {
  constructor() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)").matches
    this.immediateAlways = prefersReducedMotion
    if (document.body.dataset.animatorImmediate === "true") {
      this.immediateAlways = true
    }
    else if (document.body.dataset.animatorImmediate === "false") {
      this.immediateAlways = false
    }
  }
}

export default AnimatorPreferences
