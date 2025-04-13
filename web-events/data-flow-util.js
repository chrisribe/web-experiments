// This utility provides a simple way to create custom web components
// and manage events in a declarative manner. It allows you to define components
// with templates, styles, and methods, and also provides a way to dispatch and listen
// for custom events.
const DFlow = {
  createComponent(name, { template, styles, methods = {} }) {
    class CustomElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<style>${styles}</style>${template}`;
      }
    }
    
    // Add the methods to the prototype
    Object.assign(CustomElement.prototype, methods);
    
    // Register the component
    customElements.define(name, CustomElement);
    
    // Return the class for any further customization
    return CustomElement;
  },
  
  dispatch(eventName, detail) {
    document.dispatchEvent(new CustomEvent(eventName, {
      detail, bubbles: true, composed: true
    }));
  },
  
  listen(eventName, callback) {
    document.addEventListener(eventName, callback);
  }
};