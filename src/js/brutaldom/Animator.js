import AnimatorPreferences from "./AnimatorPreferences"

/**
 * Simplified abstraction over the `Element.animate()` method, useful for
 * animations where you are animating to certain styles and you want those
 * styles to persist after the animation, e.g. for hiding elements.
 *
 * Uses AnimatorPreferences to alter its behavior based on the user's browser.
 *
 * @see AnimatorPreferences
 * @see external:Element-animate
 *
 */
class Animator {
  /**
   * Create an Animator that can animate the given element forward and backward.
   *
   * @param {external:Element} element - The Element that will be animated
   * @param {Object} namedParams
   * @param {Number} [namedParams.duration=500] - a number representing the ms for the animation.
   * @param {String} [namedParams.easing="ease-in"] - An easing value for the animation. Should be a known [easing function]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function}
   * @param {Object} namedParams.styles - An object where the keys are styles that can be animated.  Each key's
   *          value should be an object with the keys "from" and "to".  For forward
   *          animations, the element will be animated from the "from" to the "to"
   *          and the "to" styles will be applied at the end.  For backwards animation
   *          it uses "to" as the starting point and "from" as the end, with the
   *          "from" styles being applied.
   *
   */
  constructor(element, { duration, easing, styles, animatorPreferences }) {
    this.element  = element
    this.duration = duration || 500
    this.easing   = easing   || "ease-in"

    this.animatorPreferences = new AnimatorPreferences()

    this.from = {}
    this.to   = {}
    this.whenDoneForward = []
    this.whenDoneBackward = []

    Object.entries(styles).forEach( (entry) => {
      const styleName   = entry[0]
      const styleFromTo = entry[1]

      this.from[styleName] = styleFromTo.from
      this.to[styleName]  = styleFromTo.to
      this.whenDoneForward.push( () => {
        this.element.style[styleName] = styleFromTo.to
      })
      this.whenDoneBackward.push( () => {
        this.element.style[styleName] = styleFromTo.from
      })
    })
  }

  /**
   * Animate the element forward, with "from" at the start and
   * "to" at the end.
   *
   * @param {Number} [durationOverride] - Set this to override the duration in ms used in the constructor.
   *
   * @returns {external:Promise} on which you can call then() to perform additional
   * functions after the animation completes. Note when animation is skipped, the 'from' state is set immediately on the element,
   * but the promise is still returned
   */
  animateForward(durationOverride) {
    if (this.animatorPreferences.immediateAlways) {
      this.setForwardNow()
      return Promise.resolve()
    }
    else {
      return this._animate(
        this.from,
        this.to,
        durationOverride
      ).then( () => this.setForwardNow() )
    }
  }

  /**
   * Set the element to its completed-after-forward-animation state
   * immediately. This is useful if you want to style a component
   * in its pre-animated state, but bring the UI with the forward
   * animation completed.
   *
   * @returns {undefined}
   */
  setForwardNow() {
    this.whenDoneForward.forEach( (f) => f() )
  }

  /**
   * Animate the element backwaord, with "to" at the start and
   * "from" at the end.
   *
   * @param {Number} [durationOverride] - Set this to override the duration in ms used in the constructor.
   *
   * @returns {external:Promise} on which you can call then() to perform additional
   * functions after the animation completes
   */
  animateBackward(durationOverride) {
    if (this.animatorPreferences.immediateAlways) {
      this.setBackwardNow()
      return Promise.resolve()
    }
    else {
      return this._animate(
        this.to,
        this.from,
        durationOverride
      ).then( () => this.setBackwardNow() )
    }
  }

  /**
   * Set the element to its completed-after-backward-animation state
   * immediately. This is useful if you want to style a component
   * in its pre-animated state, but being the UI with the forward
   * animation completed.
   *
   * @returns {undefined}
   */
  setBackwardNow() {
    this.whenDoneBackward.forEach( (f) => f() )
  }

  _animate(to,from,durationOverride) {
    return this.element.animate(
      [
        to,
        from,
      ],
      {
        duration: durationOverride || this.duration,
        easing: this.easing,
      }
    ).finished
  }

}

export default Animator
