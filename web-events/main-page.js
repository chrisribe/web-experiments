(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const componentEventNames = [
      'product:purchase',
      'product:purchase-reply',
      'product:live-events'
    ];
    EventBus.register(componentEventNames);

    EventBus.listen('product:purchase', (event) => {
      const { product, requesterId } = event.detail;
      handlePurchase(product, requesterId);
    });
    
    function handlePurchase(productName, requesterId) {
      console.log('Product purchased:', productName);
      
      // Simulate an asynchronous operation (e.g., XHR request)
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