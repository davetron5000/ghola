import TypeOf from "./TypeOf"

class MarkName {
  constructor(className, methodName) {
    this.measure = `${className}::${methodName}`
    this.start = `${this.measure}#start`
    this.stop = `${this.measure}#stop`
  }
}
export default class MethodMeasurement {
  static measure(object,methodName,code) {
    const measurement = new MethodMeasurement(performance,object,methodName)
    const result = code(measurement)
    measurement.done()
    return result
  }

  static debug(name,code) {
    MethodMeasurement._debug = name
    const result = code()
    MethodMeasurement._debug = null
    return result
  }

  constructor(performance,object,methodName,detail = {}) {
    this.performance = performance
    this.object      = object
    this.detail      = detail
    if (MethodMeasurement._debug) {
      this.detail.inspect = true
      this.detail.debug = MethodMeasurement._debug.toString()
    }

    this.markName = new MarkName(TypeOf.asString(object), methodName)

    this.performance.mark(this.markName.start)
  }


  done(cb) {
    this.performance.mark(this.markName.stop)
    const measurement = this.performance.measure(
      this.markName.measure,
      {
        start: this.markName.start, 
        end: this.markName.stop,
        detail: this.detail,
      }
    )
    if (cb) {
      cb(measurement)
    }
  }

  duplicate(newMethodName) {
    return new MethodMeasurement(this.performance,this.object,newMethodName, this.detail)
  }

  measureCode(name,code) {
    const measure = this.duplicate(name)
    const result = code()
    measure.done( (measurement) => {
      const moreDetails = {
        name: measurement.name,
        duration: measurement.duration,
      }
      if (!this.detail.measureCode) {
        this.detail.measureCode = []
      }
      this.detail.measureCode.push(moreDetails)
    })
    return result
  }

}
