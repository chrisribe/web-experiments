(function() {
  const DFlow = {
    addEventListener(eventName, callback) {
      document.addEventListener(eventName, callback);
    },
    removeEventListener(eventName, callback) {
      document.removeEventListener(eventName, callback);
    },
    dispatchEvent(eventName, detail) {
      document.dispatchEvent(new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
      }));
    }
  };
  
  // Expose the DFlow object globally
  window.DFlow = DFlow;

  class ProductPurchase extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.id = `data-requester-${Math.random().toString(36).substr(2, 9)}`;
      this.render();
      this.setupEventListeners();
      this.setupReplyListener();
    }

    setupEventListeners() {
      this.shadowRoot.querySelectorAll('.purchase-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const productName = e.target.getAttribute('data-product');
          DFlow.dispatchEvent('purchase', { product: productName, requesterId: this.id });
        });
      });
    }

    setupReplyListener() {
      DFlow.addEventListener('purchase-reply', (event) => {
        if (event.detail.requesterId === this.id) {
          this.handleResponse(event.detail);
        }
      });

      DFlow.addEventListener('live-events', (event) => {
          this.handleLiveResponse(event.detail);
      });
    }

    handleResponse(data) {
      console.log(`Response received for ${this.id}:`, data);
      if (data.success) {
        // Update the total count of purchases
        // Get the total count element using set value and add 1 to it.
        let totalElement = this.shadowRoot.getElementById(data.product.toLowerCase() + '-count');
        let totalCount = parseInt(totalElement.textContent);
        totalElement.textContent = totalCount + 1;
      } else {
        // show red box around the product total count
        let totalElement = this.shadowRoot.getElementById(data.product.toLowerCase() + '-count');
        totalElement.style.backgroundColor = 'red';
        // fade out the red border after 1 second
        setTimeout(() => {
          totalElement.style.backgroundColor = 'initial';
        }, 3000);
      }
    }
    
    handleLiveResponse(data) {
      console.log(`Live Response received for ${this.id}:`, data);
      let liveEvents = this.shadowRoot.querySelector('.live-events');
      liveEvents.textContent = data.cnt;

    }
    render() {
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
          .total-purchases {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 1.2em;
            color: #333;
          }
          .events{
            align-items: center;
            padding: 10px 0;
          }
        </style>
        <div class="container">
          <div class="product-item">
            <span>Product 1</span>
            <div class="product-count">
              <button class="purchase-button" part="purchase-button" data-product="Product-1">Purchase</button>
              <span id="product-1-count">0</span>
            </div>
          </div>
          <div class="product-item">
            <span>Product 2</span>
            <div class="product-count">
              <button class="purchase-button" data-product="Product-2">Purchase</button>
              <span id="product-2-count">0</span>  
            </div>
          </div>
          <div class="events">
            <span>Live events</span>
            <div class="live-events">
          </div>
        </div>
      `;
    }
  }

  customElements.define('product-purchase', ProductPurchase);

})();