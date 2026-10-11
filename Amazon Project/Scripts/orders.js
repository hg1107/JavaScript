import { orders } from "../data/orders.js";
import { addToCart, getCartQuantity } from "../data/cart.js";

// Update cart count in header
document.querySelector(".js-cart-quantity").innerHTML = getCartQuantity();

function renderOrders() {
  const ordersGrid = document.querySelector(".js-orders-grid");
  if (!ordersGrid) return;

  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon">📦</div>
        <div class="empty-orders-title">No orders yet</div>
        <p>Looks like you haven't placed any orders. <a href="amazon.html" class="link-primary">Start shopping →</a></p>
      </div>
    `;
    return;
  }

  let html = "";
  orders.forEach((order) => {
    let productsHTML = "";
    order.products.forEach((item) => {
      productsHTML += `
        <div class="product-image-container">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="product-details">
          <div class="product-name">${item.name}</div>
          <div class="product-delivery-date">Arriving on: ${item.estimatedDelivery}</div>
          <div class="product-quantity">Quantity: ${item.quantity}</div>
          <button class="buy-again-button button-primary js-buy-again"
            data-product-id="${item.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png" alt="">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
            <button class="track-package-button button-secondary">Track package</button>
          </a>
        </div>
      `;
    });

    html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.datePlaced}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${calculateOrderTotal(order)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = html;

  // Buy again
  document.querySelectorAll(".js-buy-again").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.productId, 1);
      document.querySelector(".js-cart-quantity").innerHTML = getCartQuantity();
      btn.textContent = "Added!";
      btn.style.background = "rgb(6,125,98)";
      btn.style.color = "white";
      setTimeout(() => {
        btn.innerHTML = `<img class="buy-again-icon" src="images/icons/buy-again.png" alt=""><span class="buy-again-message">Buy it again</span>`;
        btn.style.background = "";
        btn.style.color = "";
      }, 2000);
    });
  });
}

function calculateOrderTotal(order) {
  let total = 0;
  order.products.forEach((item) => {
    total += item.priceCents * item.quantity;
  });
  return (total / 100).toFixed(2);
}

renderOrders();
