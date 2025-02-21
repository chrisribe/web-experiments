(function(){
  class DataRequester extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
      this.render();
      this.setupEventListeners();
    }

    setupEventListeners() {
      this.shadowRoot.querySelectorAll('.purchase-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const productName = e.target.getAttribute('data-product');
          this.purchaseProduct(productName);
        });
      });
    }

    purchaseProduct(productName) {
        const eventDispatcher = document.createElement('event-dispatcher');
        eventDispatcher.setAttribute('event-name', 'purchase');
        eventDispatcher.setAttribute('event-detail', JSON.stringify({ product: productName }));
        this.shadowRoot.appendChild(eventDispatcher);
        this.shadowRoot.removeChild(eventDispatcher);
    }

    render(){
      this.shadowRoot.innerHTML = `
        <style>
          .product-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }
          .purchase-button {
            padding: 8px 12px;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .purchase-button:hover {
            background: #45a049;
          }
        </style>
        <div class="container">
          <div class="product-item">
            <span>Product 1</span>
            <button class="purchase-button" data-product="Product 1">Purchase</button>
          </div>
          <div class="product-item">
            <span>Product 2</span>
            <button class="purchase-button" data-product="Product 2">Purchase</button>
          </div>
        </div>
      `;
    }
  }

  customElements.define('data-requester', DataRequester);

   //-------------------------
   class EventDispatcher extends HTMLElement {
    connectedCallback() {
      const eventName = this.getAttribute('event-name');
      const eventDetail = this.getAttribute('event-detail');
      const detail = eventDetail ? JSON.parse(eventDetail) : {};
      this.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
    }
  }
  
  customElements.define('event-dispatcher', EventDispatcher);   

  class EventListener extends HTMLElement {
    connectedCallback() {
      const eventName = this.getAttribute('event-name');
      document.addEventListener(eventName, (event) => {
        const callback = this.getAttribute('callback');
        if (callback && typeof window[callback] === 'function') {
          window[callback](event);
        }
      });
    }
  }
  
  customElements.define('event-listener', EventListener);


  // DFlow object to manage event listeners
  const DFlow = {
    addEventListener(eventName, callback, options = {}) {
      const eventListener = document.createElement('event-listener');
      eventListener.setAttribute('event-name', eventName);
      eventListener.setAttribute('callback', callback.name);
      if (options.once) {
        eventListener.setAttribute('once', '');
      }
      document.body.appendChild(eventListener);
      return eventListener;
    },
    removeEventListener(eventListener) {
      if (eventListener instanceof HTMLElement && eventListener.tagName === 'EVENT-LISTENER') {
        eventListener.disconnectedCallback();
        document.body.removeChild(eventListener);
      }
    }
  };
  // Expose the DFlow object globally
  window.DFlow = DFlow;  

})();
