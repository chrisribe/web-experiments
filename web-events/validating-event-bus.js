(function() {
  /**
   * A generic event bus that validates event names to prevent clashes.
   */
  const ValidatingEventBus = {
    registeredEvents: new Set(),

    /**
     * Registers one or more event names. Throws an error if an event name is already registered.
     * @param {string[]} eventNames - An array of event names to register.
     */
    register(eventNames) {
      for (const name of eventNames) {
        if (this.registeredEvents.has(name)) {
          // Fails fast and loud if a name is already taken.
          throw new Error(`Event name "${name}" is already registered. Event names must be unique.`);
        }
        this.registeredEvents.add(name);
      }
    },

    listen(eventName, callback) {
      document.addEventListener(eventName, callback);
    },

    remove(eventName, callback) {
      document.removeEventListener(eventName, callback);
    },

    /**
     * Dispatches an event. Optionally warns if the event was not pre-registered.
     */
    dispatch(eventName, detail) {
      if (!this.registeredEvents.has(eventName)) {
        // This helps catch typos or unregistered events during development.
        console.warn(`Dispatching event "${eventName}" which was not registered. Consider registering it first.`);
      }
      document.dispatchEvent(new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
      }));
    }
  };
  
  // Expose the ValidatingEventBus globally
  window.EventBus = ValidatingEventBus;
})();