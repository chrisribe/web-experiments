(function() {
  // --- All component-related code is now in this single file ---

  // 1. DEFINE and REGISTER the events for this feature
  const componentEventNames = [
    'product:purchase',
    'product:purchase-reply',
    'product:live-events'
  ];
  EventBus.register(componentEventNames);


  // 2. DEFINE the ProductPurchase Web Component
  class ProductPurchase extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.handlePurchaseReply = this.handlePurchaseReply.bind(this);
      this.handleLiveResponse = this.handleLiveResponse.bind(this);
    }

    connectedCallback() {
      this.id = `data-requester-${Math.random().toString(36).substr(2, 9)}`;
      this.render();
      this.setupEventListeners();
      this.setupReplyListener();
    }

    disconnectedCallback() {
      EventBus.remove('product:purchase-reply', this.handlePurchaseReply);
      EventBus.remove('product:live-events', this.handleLiveResponse);
    }

    setupEventListeners() {
      this.shadowRoot.querySelectorAll('.purchase-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const productName = e.target.getAttribute('data-product');
          EventBus.dispatch('product:purchase', { product: productName, requesterId: this.id });
        });
      });
    }

    setupReplyListener() {
      EventBus.listen('product:purchase-reply', this.handlePurchaseReply);
      EventBus.listen('product:live-events', this.handleLiveResponse);
    }

    handlePurchaseReply(event) {
      if (event.detail.requesterId === this.id) {
        this.handleResponse(event.detail);
      }
    }
    
    handleResponse(data) {
      console.log(`Response received for ${this.id}:`, data);
      if (data.success) {
        let totalElement = this.shadowRoot.getElementById(data.product.toLowerCase() + '-count');
        let totalCount = parseInt(totalElement.textContent);
        totalElement.textContent = totalCount + 1;
      } else {
        let totalElement = this.shadowRoot.getElementById(data.product.toLowerCase() + '-count');
        totalElement.style.backgroundColor = 'red';
        setTimeout(() => {
          totalElement.style.backgroundColor = 'initial';
        }, 3000);
      }
    }
    
    handleLiveResponse(event) {
      const data = event.detail;
      console.log(`Live Response received for ${this.id}:`, data);
      let liveEvents = this.shadowRoot.querySelector('.live-events');
      liveEvents.textContent = data.cnt;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .product-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .purchase-button { padding: 8px 12px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .purchase-button:hover { background: #45a049; }
          .events{ align-items: center; padding: 10px 0; }
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
            <div class="live-events"></div>
          </div>
        </div>
      `;
    }
  }
  customElements.define('product-purchase', ProductPurchase);


  // 3. DEFINE the main application logic (the "backend")
  document.addEventListener('DOMContentLoaded', () => {
    EventBus.listen('product:purchase', (event) => {
      const { product, requesterId } = event.detail;
      handlePurchase(product, requesterId);
    });
    
    function handlePurchase(productName, requesterId) {
      console.log('Product purchased:', productName);
      
      setTimeout(() => {
        let success = updateProductCount(productName);
        const response = { success: success, product: productName, requesterId };
        EventBus.dispatch('product:purchase-reply', response);
      }, 300);
    }    

    setInterval(() => {
      EventBus.dispatch('product:live-events', { 
        message: 'Live events are happening!', 
        cnt: Math.floor(Math.random() * 100)
      });
    }, 5000);
  });

  function updateProductCount(productName) {
    const productCountElement = document.getElementById(`${productName.toLowerCase().replace(' ', '')}-count`);
    if (productCountElement) {
      let count = parseInt(productCountElement.textContent);
      if (count > 0) {
        productCountElement.textContent = count - 1;
        return true;
      }
    }
    return false;
  }
})();
