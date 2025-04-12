(function(){
  document.addEventListener('DOMContentLoaded', () => {

    DFlow.addEventListener('purchase', (event) => {
      const { product, requesterId } = event.detail;
      handlePurchase(product, requesterId);
    });
    
    function handlePurchase(productName, requesterId) {
      console.log('Product purchased:', productName);
      
      // Simulate an asynchronous operation (e.g., XHR request)
      setTimeout(() => {
        let success = updateProductCount(productName);
        const response = { success: success, product: productName, requesterId };
        DFlow.dispatchEvent('purchase-reply', response);
      }, 300);
    }    

    setInterval(() => {
      DFlow.dispatchEvent('live-events', { 
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