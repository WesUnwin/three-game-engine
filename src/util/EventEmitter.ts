interface EventListenerMap {
  [eventName: string]: ((args: any) => void)[];
}

/**
 * To reduce dependenciese on third party sources, here is a simplistic event emitter
 * class that can be used to emit, and listen for events.
 */
class EventEmitter  {
  eventListeners: EventListenerMap;
  oneTimeListeners: EventListenerMap;

  constructor() {
    this.eventListeners = {};
    this.oneTimeListeners = {};
  }

  emit(eventName: string, args?: any) {
    const callbackFns = (this.eventListeners[eventName] || []).concat(this.oneTimeListeners[eventName] || []);
    this.oneTimeListeners[eventName] = [];
    callbackFns.forEach(fn => fn(args));
  }

  addEventListener(eventName, fn) {
    const existingListeners = this.eventListeners[eventName] || [];
    this.eventListeners[eventName] = existingListeners.concat(fn);
  }

  once(eventName, fn) {
    const existingListeners = this.oneTimeListeners[eventName] || [];
    this.oneTimeListeners[eventName] = existingListeners.concat(fn);
  }

  removeEventListener(eventName, fn) {
    this.eventListeners[eventName] = this.eventListeners[eventName].filter(fn => fn !== fn);
  }
}

export default EventEmitter;