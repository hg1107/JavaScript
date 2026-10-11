import { getOrder, orders } from "../data/orders.js";
import { getCartQuantity } from "../data/cart.js";

// Update cart count in header
const cartQtyEl = document.querySelector(".js-cart-quantity");
if (cartQtyEl) {
  cartQtyEl.innerHTML = getCartQuantity();
}

function renderTracking() {
  const container = document.querySelector(".js-order-tracking");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const productId = urlParams.get("productId");

  let order = orderId ? getOrder(orderId) : null;
  let productItem = null;

  if (order) {
    productItem = order.products.find((p) => p.productId === productId) || order.products[0];
  } else if (orders.length > 0) {
    // Fallback to the latest order if available
    order = orders[0];
    productItem = order.products[0];
  }

  if (!order || !productItem) {
    container.innerHTML = `
      <div class="empty-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">← View all orders</a>
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
          <div style="font-size: 22px; font-weight: 700; margin-bottom: 10px;">No Tracking Details Found</div>
          <p style="color: #666; margin-bottom: 20px;">We couldn't find tracking information for this item.</p>
          <a href="orders.html" class="button-primary" style="display:inline-block; padding: 10px 24px; border-radius: 8px; text-decoration: none;">View Your Orders</a>
        </div>
      </div>
    `;
    return;
  }

  // Calculate progress
  const currentTime = Date.now();
  const orderTime = order.datePlacedTimestamp || (currentTime - 1000 * 60 * 60 * 12);
  const deliveryTime = productItem.estimatedDeliveryTimestamp || (orderTime + 1000 * 60 * 60 * 24 * 3);

  let progressPercent;
  if (currentTime >= deliveryTime) {
    progressPercent = 100;
  } else if (currentTime <= orderTime) {
    progressPercent = 10;
  } else {
    progressPercent = Math.round(((currentTime - orderTime) / (deliveryTime - orderTime)) * 100);
    progressPercent = Math.max(10, Math.min(95, progressPercent));
  }

  let isPreparing = progressPercent < 50;
  let isShipped = progressPercent >= 50 && progressPercent < 100;
  let isDelivered = progressPercent >= 100;

  let deliveryStatusText = isDelivered
    ? `Delivered on ${productItem.estimatedDelivery}`
    : `Arriving on ${productItem.estimatedDelivery}`;

  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      ← View all orders
    </a>

    <div class="delivery-date">
      ${deliveryStatusText}
    </div>

    <div class="product-info">
      <strong>Product:</strong> ${productItem.name}
    </div>

    <div class="product-info">
      <strong>Quantity:</strong> ${productItem.quantity}
    </div>

    <div class="product-info" style="color: #555; font-size: 14px; margin-top: 4px;">
      Order ID: <span style="font-family: monospace;">${order.id}</span>
    </div>

    <img class="product-image" src="${productItem.image}" alt="${productItem.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${isPreparing ? "current-status" : ""}">
        Preparing
      </div>
      <div class="progress-label ${isShipped ? "current-status" : ""}">
        Shipped
      </div>
      <div class="progress-label ${isDelivered ? "current-status" : ""}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercent}%;"></div>
    </div>
  `;
}

renderTracking();
