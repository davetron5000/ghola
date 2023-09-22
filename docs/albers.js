(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // node_modules/brutaldom/src/js/TypeOf.js
  var TypeOf = class _TypeOf {
    static {
      __name(this, "TypeOf");
    }
    /**
     * Get the type of the given value.  This will check if its a function, and use the name. If it has a constructor, it will use
     * that constructor's name, otherwise it will use whatever typeof returns.  This will swallow any errors.
     *
     * @param {Object} value - anything
     */
    constructor(value) {
      this.typeName = typeof value;
      try {
        if (typeof value === "function" && value.name) {
          this.typeName = value.name;
        } else if (value && value.constructor && value.constructor.name) {
          this.typeName = value.constructor.name;
        }
      } catch (error) {
        console.error(error);
      }
    }
    /** @returns {String} the string for the name of this type */
    toString() {
      return this.typeName;
    }
    /** @returns the String of a value, skipping the need to create and hold onto an instance of this class */
    static asString(value) {
      return new _TypeOf(value).toString();
    }
  };
  var TypeOf_default = TypeOf;

  // node_modules/brutaldom/src/js/Log.js
  var LogMixin = {
    /** Used to log the start of a method for later measurement of the method's duration.
     *
     * @param {String} methodName - name of the method that just got called
     * @param {Object} details - passed to performance.mark
     */
    methodStart(methodName, details) {
      this.event(`${methodName}#called`, details);
    },
    /** Used to log the end of a method. You must have called methodStart. This will
     * record an event and a measurement
     *
     * @param {String} methodName - name of the method that just got called
     * @param {Object} details - passed to performance.mark and performance.measure
     *
     */
    methodDone(methodName, details) {
      this.event(`${methodName}#completed`, details);
      this.measure(methodName, `${methodName}#called`, `${methodName}#completed`);
    },
    /**
     * Record an event via performance.mark
     *
     * @param {String} eventName - name of the event - can be anything
     * @param {Object} details - passed to performance.mark and performance.measure. Added to the default details this mixin stores.
     */
    event(eventName, details) {
      details = { ...this.__defaultDetails(), ...details };
      performance.mark(this._name(eventName), { detail: details });
      this.__logMixinDetails = { ...this.__logMixinDetails, ...details };
    },
    /**
     * Record a measurement with performance.measure
     *
     * @param {String} measurementName - name of the measurement. Can be anything.
     * @param {String} start - the start mark name, as used in the Performance API
     * @param {String} end - the end mark name, as used in the Performance API
     */
    measure(measurementName, start, end) {
      if (!start) {
        throw `You forgot to add start & end to measure(${measurementName})`;
      } else if (!end) {
        throw `You forgot to add end to measure(${measurementName})`;
      }
      performance.measure(
        this._name(measurementName),
        {
          start: this._name(start),
          end: this._name(end),
          detail: this.__logMixinDetails
        }
      );
    },
    _name(eventName) {
      if (this.constructor && this.constructor.logContext) {
        return `${this.constructor.logContext}.${this.__className()}.${eventName}`;
      } else {
        return `${this.__className()}.${eventName}`;
      }
    },
    __defaultDetails() {
      const details = {
        logContext: this.constructor.logContext || "UNKNOWN",
        className: this.__className()
      };
      if (window && window.location) {
        details[`window.location.pathname`] = window.location.pathname;
      }
      return details;
    },
    __className() {
      return TypeOf_default.asString(this);
    },
    /** Mixes this into any class
     * @param {Class} klass - a Class
     */
    mixin(klass) {
      Object.assign(klass.prototype, LogMixin);
    }
  };
  var Log_default = LogMixin;

  // node_modules/brutaldom/src/js/BrutalDOMBase.js
  var BrutalDOMBase = class {
    static {
      __name(this, "BrutalDOMBase");
    }
    static logContext = "brutaldom";
    constructor() {
      Log_default.mixin(this.constructor);
    }
  };
  var BrutalDOMBase_default = BrutalDOMBase;

  // node_modules/brutaldom/src/js/WrapsElement.js
  var WrapsElement = class extends BrutalDOMBase_default {
    static {
      __name(this, "WrapsElement");
    }
    /**
     * Create the wrapped element.
     *
     * @param {external:Element} Element to wrap
     */
    constructor(element, ...args) {
      super();
      this.element = element;
      if (this.wasCreated) {
        this.wasCreated(...args);
      }
    }
    /**
     * Called with no arguments
     * @callback WrapsElement~whenNotFound
     */
    /**
     * Called with no arguments
     * @callback WrapsElement~whenMultipleFound
     * @param {Number} number of elements found.  Will be greater than 1.
     */
    /** Access an element relvative to this component's element based on
     *  a selector as you'd use for querySelectorAll() or querySelector()
     *
     *  It is expected to return exactly one element and will blow up if it does not
     *  locate exactly one.
     *
     *  If exactly on element is not found, by default an error is thrown. You can
     *  customize this behavior by providing whenNotFound and/or whenMultipleFound.
     *
     *  @param {String} selector -  A selector compatible wiht querySelectorAll or querySelector
     *  @param {external:Element} baseElement -  if omitted, uses this component's element. If given, uses it
     *                as the basis for the search.
     *  @param {WrapsElement~whenNotFound} whenNotFound -  if provided, will be called if no elements matching the selector
     *                 are found. No arguments given.
     *  @param {WrapsElement~whenMultipleFound} whenMultipleFound -  if provided, will be called if more than one element matching
     *                      the selector is found. Given an argument with the number of elements found.
     *                  
     *  @returns {external:Element} Return the element located.  Return value is undefined if whenNotFound or whenMultipleFound are
     *  called.
     *
     *  @throws an error if no elements matched and whenNotFound was not provided, OR if more than one element matched and
     *  whenMultipleFound was not provided.
     *
     */
    $selector(selector, baseElement, whenNotFound, whenMultipleFound) {
      if (!baseElement) {
        baseElement = this.element;
      }
      if (!(baseElement instanceof Element) && !(baseElement instanceof Document)) {
        throw `Base element should be an Element or Document. Got ${JSON.stringify(baseElement)}`;
      }
      if (!whenNotFound) {
        whenNotFound = /* @__PURE__ */ __name(() => {
          throw `Could not find '${selector}' from ${baseElement.outerHTML}`;
        }, "whenNotFound");
      }
      if (!whenMultipleFound) {
        whenMultipleFound = /* @__PURE__ */ __name((numFound) => {
          throw `Found ${numFound} nodes instead of 1 matching '${selector}' from ${baseElement.outerHTML}`;
        }, "whenMultipleFound");
      }
      const elements = baseElement.querySelectorAll(selector);
      if (elements.length == 1) {
        return elements.item(0);
      } else if (elements.length == 0) {
        return whenNotFound();
      } else {
        return whenMultipleFound(elements.length);
      }
    }
    /** Access elements relvative to this component's element based on
     *  a selector as you'd use for querySelectorAll(), but with the requirement
     *  that at least one element be found.
     *
     *  @param {String} selector - A selector compatible wiht querySelectorAll or querySelector
     *  @param {external:Element} baseElement - if omitted, uses this component's element. If given, uses it
     *                as the basis for the search.
     *                  
     *  @returns {external:Element[]} the elements located
     *  @throws an error if no elements matched
     */
    $selectors(selector, baseElement) {
      if (!baseElement) {
        baseElement = this.element;
      }
      const elements = baseElement.querySelectorAll(selector);
      if (elements.length == 0) {
        throw `Expected ${selector} to return 1 or more elements, but matched 0 from ${baseElement}`;
      }
      return elements;
    }
    /** Calls $selector with `[data-${dataAttribute}]` */
    $(dataAttribute, baseElement, whenNotFound) {
      return this.$selector(`[data-${dataAttribute}]`, baseElement, whenNotFound);
    }
    /** Calls $selector with `[slot=name='${slotName}']` */
    $slot(slotName, baseElement, whenNotFound) {
      return this.$selector(`slot[name='${slotName}']`, baseElement, whenNotFound);
    }
    /** Calls $selectors with `slot[name='${slotName}']` */
    $slots(slotName, baseElement) {
      return this.$selectors(`slot[name='${slotName}']`, baseElement);
    }
  };
  var WrapsElement_default = WrapsElement;

  // node_modules/brutaldom/src/js/Body.js
  var Body = class extends WrapsElement_default {
    static {
      __name(this, "Body");
    }
    constructor() {
      super(document.body);
    }
  };
  var Body_default = Body;

  // node_modules/brutaldom/src/js/Template.js
  var Template = class extends WrapsElement_default {
    static {
      __name(this, "Template");
    }
    /**
     * Create a Template with the given element. Note that the element *must*
     * be a `template` element.
     *
     * @param {external:Element} element - Element that this will wrap. It must be a `template` element.
     */
    constructor(element) {
      super(element);
      if (this.element.tagName != "TEMPLATE") {
        throw `You may not create a Template from a ${this.element.tagName}`;
      }
    }
    /**
     * Create a new `Node` based on this template. The new node will
     * optionally have any slots it contains filled with values. This Node can be inserted into the DOM.
     *
     * @param {Object} options
     * @param {Object} options.fillSlots - if present, this is an object where the property names are assumed to be slots with that name and the values are to be set as the innerText of the slot.  Each element of this object *must* be a slot inside the template. There can be more than one slot with any name and all will be filled in.
     *
     * @returns {external:Node} a new Node, filled with `options.fillSlots`, ready to be inserted into the DOM. 
     */
    newNode(options) {
      this.methodStart("newNode");
      const node = this.element.content.firstElementChild.cloneNode(true);
      this.event("newNode", { fillSlots: options ? options.fillSlots : void 0 });
      if (options && options.fillSlots) {
        Object.entries(options.fillSlots).forEach(([name, value]) => {
          this.$slots(name, node).forEach((slot) => {
            slot.innerText = value;
          });
        });
      }
      this.methodDone("newNode");
      return node;
    }
  };
  var Template_default = Template;

  // node_modules/brutaldom/src/js/Component.js
  var Component = class extends WrapsElement_default {
    static {
      __name(this, "Component");
    }
    /**
     * Creates a new component
     *
     * @param {external:Element} element - an Element from a web page that this component wraps
     * @param {...args} args - passed to the super class and then to `wasCreated` if implemented.
     *
     */
    constructor(element, ...args) {
      super(element, ...args);
      this.element = element;
      this.hidden = window.getComputedStyle(this.element).display === "none";
    }
    /**
     * Creates a `Template` based on an element inside this component.
     *
     * A common pattern with dynamic UIs is to use a template element to create dynamic
     * elements with actual data in them.  This method simplifies that by locating the
     * template (which is assumed to exist or there is an error) and then returning
     * an instance of `Template` that wraps the templated markup.
     *
     * @param {String} dataAttribute - if present, the name of a data attribute to identify the template. This will be combined with `data-` so you should omit that. If omitted, this will locate a `template` element.  In either case, there must be exactly one such element within this component's element (or the provided `baseElement`)
     * @param {Element} baseElement - if present, this is used to locate the template.  If omitted, will use this component's wrapped element.
     *
     * @returns {Template} a Template instance wrapping the template element
     */
    template(dataAttribute, baseElement) {
      const selector = dataAttribute ? `template[data-${dataAttribute}]` : "template";
      return new Template_default(this.$selector(selector, baseElement));
    }
    /**
     * Hides a component.
     *
     * It's common to want to hide or show components. This method can be called
     * by others to hide the component. By default, the hiding is done via 
     * the CSS display property.  If an animator is configured, it is used instead.
     *
     * XXX: Change impl
     */
    hide() {
      this.hidden = true;
      if (this.animator) {
        this.animator.animateBackward();
      } else {
        this.element.classList.remove("db");
        this.element.classList.add("dn");
      }
    }
    /**
     * Shows a component.
     *
     * It's common to want to hide or show components. This method can be called
     * by others to show the component. By default, the showing is done via 
     * the CSS display property.  If an animator is configured, it is used instead.
     *
     * XXX: Change impl
     */
    show() {
      this.hidden = false;
      if (this.animator) {
        this.animator.animateForward();
      } else {
        this.element.classList.remove("dn");
        this.element.classList.add("db");
      }
    }
    /** Toggles the shown/hidden state */
    toggle() {
      if (this.hidden) {
        this.show();
      } else {
        this.hide();
      }
    }
  };
  var Component_default = Component;

  // node_modules/brutaldom/src/js/HumanizedString.js
  var HumanizedString = class _HumanizedString {
    static {
      __name(this, "HumanizedString");
    }
    /**
     * @param {String} string - string to humanize
     * @returns {HumanizedString} for the given string.
     */
    static for(string) {
      return new _HumanizedString(string);
    }
    /**
     * Create a HumanizedString, coercing falsey values to the empty string
     *
     * @param {String} string - string to humanize. May be undefined.
     */
    constructor(string) {
      string = `${string || ""}`;
      this.string = string[0].toUpperCase() + string.slice(1);
    }
    /** @returns {String} the humanized string */
    toString() {
      return this.string;
    }
  };
  var HumanizedString_default = HumanizedString;

  // node_modules/brutaldom/src/js/EventAlreadyDefined.js
  var EventAlreadyDefined = class extends Error {
    static {
      __name(this, "EventAlreadyDefined");
    }
    constructor(eventName, propertyNameFound) {
      super(`${eventName} appears to have already been defined - found '${propertyNameFound}' defined`);
      this.eventName = eventName;
      this.propertyNameFound = propertyNameFound;
    }
  };
  var EventAlreadyDefined_default = EventAlreadyDefined;

  // node_modules/brutaldom/src/js/EventManager.js
  var debounce = /* @__PURE__ */ __name((callback, wait) => {
    let timeout;
    return (...args) => {
      const context = void 0;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback.apply(context, args);
      }, wait);
    };
  }, "debounce");
  var EventDefinition = class {
    static {
      __name(this, "EventDefinition");
    }
    /**
     * Create an EventDefinition, but don't add it to the object, yet.
     *
     * @param {Object} object - the object that will fire this event
     * @param {String} name - name of the event
     *
     * @throws {EventAlreadyDefined} if the object already has this event defined or if the methods it will create conflict with existing methods.
     */
    constructor(object, name) {
      this.object = object;
      this.name = name;
      this.eventManagerName = `${name}EventManager`;
      this.addListenerName = `on${HumanizedString_default.for(name)}`;
      if (object[this.eventManagerName]) {
        throw new EventAlreadyDefined_default(name, this.eventManagerName);
      }
      if (object[this.addListenerName]) {
        throw new EventAlreadyDefined_default(name, this.addListenerName);
      }
    }
    /**
     * Create the event mechanism on the object.  This modified the object 
     * passed to the constructor so that it will have the onXXX method.
     */
    create() {
      const eventManager = new EventManager(this.object, this.name);
      this.object[this.eventManagerName] = eventManager;
      this.object[this.addListenerName] = (listener) => {
        eventManager.addListener(listener);
      };
      return eventManager;
    }
  };
  var EventManager = class extends BrutalDOMBase_default {
    static {
      __name(this, "EventManager");
    }
    /** Shortcut to creating event managers explcitly.
     *
     * Ideally used in the constructor of your class to define all
     * the events that your class will broadcast.
     *
     * @param {Object} object - the object on which the events will be defined
     * @param {...String} names - a list of names of events.  For each name, this method will define an EventManager
     *         for that named event, and then a method on«name» (where name is upper-case camelized)
     *         that will register the passed listener for that event.  To fire an event, use
     *         the EventNamager. For example, a name like "formSubmitted" would create the method `onFormSubmitted` which
     *         you could trigger by calling `this.formSubmittedEventManager.fireEvent()`
     */
    static defineEvents(object, ...names) {
      names.map((name) => {
        return new EventDefinition(object, name);
      }).forEach((eventDefinition) => {
        eventDefinition.create();
      });
    }
    /**
     * Create an EventManager attached to the given object for the given event name.
     *
     * @param {Object} object - the object that will be firing events. This is only used for logging.
     * @param {String} eventName - the name of the event.  This is only used for logging.
     */
    constructor(object, eventName) {
      super();
      this.listeners = /* @__PURE__ */ new Set();
      this.eventName = eventName;
      this.objectClass = TypeOf_default.asString(object);
    }
    /** Adds a listener to this event. 
     *
     * @param {EventManager~listener|EventManager} listener to be called when the event fires. If the listener is an instance of an
     * EventManager, that manager's `fireEvent` method is called when this manager's is fired. This makes it simpler to proxy
     * events.
     */
    addListener(listener) {
      this.listeners.add(listener);
    }
    /** Remove a listener from this event. 
     *
     * @param {EventManager~listener|EventManager} listener to be called when the event fires.
     */
    removeListener(listener) {
      return this.listeners.delete(listener);
    }
    /**
     * Modifies this EventManager to debounce its fireEvent methods by timeoutMS milliseconds.
     *
     * @param {int} timeoutMS - Milliseconds to debounce the fireEvent method. If 0, debouncing is removed.
     */
    debounce(timeoutMS) {
      if (timeoutMS == 0) {
        delete this._debouncedFireEvent;
      } else {
        this._debouncedFireEvent = debounce(this._fireEvent.bind(this), timeoutMS);
      }
    }
    /**
     * Called with whatever arguments were given to fireEvent.
     * @callback EventManager~listener
     */
    /** Fire the event, passing each listener the given args.
     *
     * @param {...Object} args - any args relevant to the event. You should document what these are.
     */
    fireEvent(...args) {
      if (this._debouncedFireEvent) {
        this.event("usingDebounced", {});
        this._debouncedFireEvent(...args);
      } else {
        this._fireEvent(...args);
      }
    }
    _fireEvent(...args) {
      this.methodStart("fireEvent", { listeners: this.listeners.size, eventName: this.eventName, objectClass: this.objectClass });
      this.listeners.forEach((listener) => {
        if (TypeOf_default.asString(listener) == "EventManager") {
          listener.fireEvent(...args);
        } else {
          listener(...args);
        }
      });
      this.methodDone("fireEvent");
    }
    /**
     * Creates an EventManager and related methods for an existing DOM event.  Calls preventDefault on
     * the fired event before triggering listeners.
     *
     * @param object {Object} - the object that is firing the event
     * @param {Object} namedParams
     * @param {external:Element} namedParams.element - Element that will fire the event
     * @param {String} namedParams.eventName - name of the event that the element will fire
     *
     * @example
     * class Button extends Component {
     *   constructor(element) {
     *     super(element)
     *     this.onClickEventManager = EventManager.createDirectProxyFor(
     *       this,
     *       {
     *         element: this.element,
     *         eventName: "click"
     *       }
     *     )
     *   }
     * }
     *
     * const button = new Button(document.querySelector("button"))
     * button.onClick( () => {
     *   // whatever the button should do
     *   // noting that preventDefault has been called
     * })
     *
     */
    static createDirectProxyFor(object, { element, eventName }) {
      const eventDefinition = new EventDefinition(object, eventName);
      const eventManager = eventDefinition.create();
      element.addEventListener(eventName, (event) => {
        event.preventDefault();
        eventManager.fireEvent(event);
      });
    }
  };
  var EventManager_default = EventManager;

  // node_modules/brutaldom/src/js/Link.js
  var Link = class extends Component_default {
    static {
      __name(this, "Link");
    }
    wasCreated() {
      this.clickEventManager = EventManager_default.createDirectProxyFor(this, { element: this.element, eventName: "click" });
    }
  };
  var Link_default = Link;

  // node_modules/brutaldom/src/js/Env.js
  var Env = class {
    static {
      __name(this, "Env");
    }
    /**
     * Create the Env
     *
     * @param {String} string - name of the env. Must be a known name.
     * @throw if string is not a known environment
     */
    constructor(string) {
      if (string === "dev" || string === "test" || string === "production") {
        this.string = string;
      } else {
        throw `'${string}' is not a valid ENV`;
      }
    }
    /** @return true if we are running in the test environment */
    isTest() {
      return this.string == "test";
    }
    /** @return true if we are running in the dev environment */
    isDev() {
      return this.string == "dev";
    }
    /** @return true if we are running in the production environment */
    isProduction() {
      return this.string == "production";
    }
    toString() {
      return this.string;
    }
  };
  var Env_default = Env;

  // node_modules/brutaldom/src/js/Runtime.js
  var Runtime = class _Runtime extends BrutalDOMBase_default {
    static {
      __name(this, "Runtime");
    }
    /** @returns {Runtime} the only instance of this class */
    static instance() {
      if (!this._instance) {
        this._instance = new _Runtime();
      }
      return this._instance;
    }
    /** @returns {Env} the env you are running in */
    static env() {
      return this.instance().env;
    }
    /**
     * Create the runtime.  This assumes that a global variable named `ENV` is defined somewhere and that it
     * has a value compatible with the Env class' constructor.
     *
     * If no such `ENV` variable exists, it will assuming it's running in the dev environment.
     *
     * @see Env
     */
    constructor() {
      super();
      if (true) {
        this.env = new Env_default("dev");
      } else {
        this.env = new Env_default("dev");
      }
      this.event("runtimeConfigured", { env: this.env.toString() });
    }
  };
  var Runtime_default = Runtime;

  // node_modules/brutaldom/src/js/LogViewer.js
  var FancyConsoleLogger = class {
    static {
      __name(this, "FancyConsoleLogger");
    }
    constructor(detailFilters) {
      this.detailFilters = detailFilters;
    }
    log(entry) {
      const detail = entry.detailFiltered(this.detailFilters);
      let additional = null;
      if (entry.attributeName) {
        additional = `${entry.attributeName}: ${entry.attributeValue}${entry.attributeUnits}`;
      }
      const consoleArgs = [
        "%s	%c%s %c%s",
        entry.char,
        "text-weight: bold; font-family: monospace; color: #00a",
        entry.name,
        "text-weight: bold; color: #0a4",
        additional
      ];
      if (Object.entries(detail).length != 0) {
        console.groupCollapsed(...consoleArgs);
        console.log("%o", detail);
        console.groupEnd();
      } else {
        console.log(...consoleArgs);
      }
    }
  };
  var BasicConsoleLogger = class {
    static {
      __name(this, "BasicConsoleLogger");
    }
    constructor(detailFilters) {
      this.detailFilters = detailFilters;
    }
    log(entry) {
      const detail = entry.detailFiltered(this.detailFilters);
      const logInfo = {
        type: entry.type,
        name: entry.name
      };
      if (entry.attributeName) {
        logInfo[entry.attributeName] = `${entry.attributeValue}${entry.attributeUnits}`;
      }
      if (Object.entries(detail).length != 0) {
        logInfo.detail = JSON.stringify(detail);
      }
      console.log(Object.entries(logInfo).map(([key, value]) => {
        return `${key}: '${value}'`;
      }).join("; "));
    }
  };
  var ConsoleLogger = FancyConsoleLogger;
  if (Runtime_default.env().isTest()) {
    ConsoleLogger = BasicConsoleLogger;
  }

  // src/js/albers.js
  document.addEventListener("DOMContentLoaded", () => {
    const body = new Body_default();
    const startButton = new Link_default(body.$("start"));
    const exercise = body.$("exercise");
    startButton.onClick(() => {
      console.log("CLICK");
      exercise.requestFullScreen({
        navigationUI: "hide"
      }).then(() => {
        console.log("FULLSCREEN");
      }).catch((e) => {
        console.error(e);
        alert("WAT");
      });
    });
  });
})();
//# sourceMappingURL=albers.js.map
