class Logger {
  static forPrefix(stringOrFalse) {
    if (!stringOrFalse) {
      return new BufferedLogger()
    }
    else {
      return new PrefixedLogger(stringOrFalse)
    }
  }
  log() {
    throw `Subclass must implement`
  }

  info(...args) { this.log("info",...args) }
  warn(...args) { this.log("warn",...args) }
}

class BufferedLogger extends Logger {
  constructor() {
    super()
    this.messages = []
  }
  log(...args) {
    this.messages.push(args)
  }
}

class PrefixedLogger extends Logger {
  constructor(prefixOrTrue) {
    super()
    this.prefix = prefixOrTrue === true ? "debug" : prefixOrTrue
  }

  dump(bufferedLogger) {
    if (bufferedLogger instanceof BufferedLogger) {
      bufferedLogger.messages.forEach( (args) => {
        this.log(...args)
      })
    }
  }

  log(level,...args) {
    if (typeof(args[0]) === "string") {
      const message = `[prefix:${this.prefix}]:${args[0]}`
      console[level](message,...(args.slice(1)))
    }
    else {
      console[level](this.prefix,...args)
    }
  }
}
export default Logger
