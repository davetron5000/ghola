import Exploration from "./Exploration"

export default class Reflection extends Exploration {
  influentialColors() {
    if (this.rating == "different") {
      // This pairing, color was perceived different
      if (this.demonstration.type == "color-same") {
        // Original pairing, color was perceived same, so it was paired with a new set of backgrounds from a "different" rating
        //
        // Conclusions:
        //
        // - backgrounds exert influence
        return [ this.demonstration.left, this.demonstration.right ]
      }
    }
    return []
  }
  impressionableColors() {
    if (this.rating == "different") {
      if (this.demonstration.type == "color-different") {
        // Original pairing, color was perceived different, so it was paired with a new set of backgrounds from a "same" rating
        //
        // Conclusions:
        //
        // - this color is influenceable
        return [ this.demonstration.color ]
      }
    }
    return []
  }

  resistantColors() {
    if (this.rating == "same") {
      // This pairing, color was perceived same
      if (this.demonstration.type == "color-same") {
        // Original pairing, color was perceived same, so it was paired with a new set of backgrounds from a "different" rating
        //
        // Conclusions:
        //
        // - this color resists influence
        return [ this.demonstration.color ]
      }
    }
    return []
  }
  nonInfluentialColors() {
    if (this.rating == "same") {
      if (this.demonstration.type == "color-different") {
        // Original pairing, color was perceived different, so it was paired with a new set of backgrounds from a "same" rating
        //
        // Conclusions:
        //
        // - backgrounds don't exert influence
        return [ this.demonstration.left, this.demonstration.right ]
      }
    }
    return []
  }
}
