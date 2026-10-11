import { cart, removeFromCart, updateDeliveryOption, updateCartItemQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  if (cart.length === 0) {
    document.querySelector(".js-order-summary").innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <div class="empty-cart-title">Your cart is empty</div>
        <p class="empty-cart-subtitle">Add items from the <a href="amazon.html" class="link-primary">product page</a>.</p>
      </div>
    `;
    renderPaymentSummary();
    updateCheckoutHeaderCount();
    return;
  }

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    if (!matchingProduct) return;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
            <div class="quantity-editor js-quantity-editor-${matchingProduct.id}" style="display:none; margin-top:8px;">
              <input type="number" min="1" max="50" value="${cartItem.quantity}"
                class="js-quantity-input quantity-input" data-product-id="${matchingProduct.id}">
              <button class="button-primary js-save-quantity" data-product-id="${matchingProduct.id}">Save</button>
              <button class="button-secondary js-cancel-quantity" data-product-id="${matchingProduct.id}">Cancel</button>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE Shipping"
          : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString}</div>
          </div>
        </div>
      `;
    });
    return html;
  }

  const orderSummaryEl = document.querySelector(".js-order-summary");
  if (orderSummaryEl) orderSummaryEl.innerHTML = cartSummaryHTML;

  updateCheckoutHeaderCount();

  // Delete
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      removeFromCart(link.dataset.productId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Update quantity toggle
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.dataset.productId;
      document.querySelector(`.js-quantity-editor-${id}`).style.display = "flex";
      link.style.display = "none";
    });
  });

  // Save quantity
  document.querySelectorAll(".js-save-quantity").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      const input = document.querySelector(`.js-quantity-input[data-product-id="${id}"]`);
      const newQty = parseInt(input.value);
      if (isNaN(newQty) || newQty < 1) return;
      updateCartItemQuantity(id, newQty);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Cancel quantity edit
  document.querySelectorAll(".js-cancel-quantity").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      document.querySelector(`.js-quantity-editor-${id}`).style.display = "none";
      document.querySelector(`.js-update-link[data-product-id="${id}"]`).style.display = "";
    });
  });

  // Delivery option
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function updateCheckoutHeaderCount() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => { cartQuantity += cartItem.quantity; });
  const link = document.querySelector(".js-return-to-home-link");
  if (link) link.innerHTML = `${cartQuantity} items`;
}
