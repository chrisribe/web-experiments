(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // document.addEventListener('purchase', (event) => {
    //   const product = event.detail.product;
    //   if (updateProductCount(product)) {
    //     console.log(`Purchase confirmed for: ${product}`);
    //   } else {

    //   }
    // });

    window.handlePurchaseEvent = function(event) {
        console.log('Product purchased:', event.detail.product);
        updateProductCount(event.detail.product);
    };
    // Ensure the event listener is added after the DOM is fully loaded
    const eventListener = document.createElement('event-listener');
    eventListener.setAttribute('event-name', 'purchase');
    eventListener.setAttribute('callback', 'handlePurchaseEvent');
    document.body.appendChild(eventListener);

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