import { cart, clearCart, getCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { saveOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  const totalCartQuantity = getCartQuantity();

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    if (product) {
      productPriceCents += product.priceCents * cartItem.quantity;
    }
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (deliveryOption) {
      shippingPriceCents += deliveryOption.priceCents;
    }
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const isEmpty = cart.length === 0;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalCartQuantity}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button"
      ${isEmpty ? "disabled" : ""}>
      ${isEmpty ? "No items in cart" : "Place your order"}
    </button>

    ${isEmpty ? "" : `<div class="order-legal-text">
      By placing your order, you agree to our <span class="link-primary">Privacy Policy</span>
      and <span class="link-primary">Terms &amp; Conditions</span>.
    </div>`}
  `;

  const paymentSummaryElement = document.querySelector(".js-payment-summary");
  if (paymentSummaryElement) {
    paymentSummaryElement.innerHTML = paymentSummaryHTML;
  }

  // Place order
  const placeOrderBtn = document.querySelector(".js-place-order-button");
  if (placeOrderBtn && !isEmpty) {
    placeOrderBtn.addEventListener("click", () => {
      saveOrder();
      clearCart();
      // Show confirmation overlay
      showOrderConfirmation();
    });
  }
}

function showOrderConfirmation() {
  // Re-render with empty state
  import("./orderSummary.js").then(({ renderOrderSummary }) => {
    renderOrderSummary();
    renderPaymentSummary();
  });

  // Create confirmation banner
  const existing = document.querySelector(".js-order-confirmation");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.className = "order-confirmation js-order-confirmation";
  banner.innerHTML = `
    <div class="order-confirmation-icon">✓</div>
    <div class="order-confirmation-title">Order placed successfully!</div>
    <p>You'll receive a confirmation shortly.</p>
    <a href="orders.html" class="button-primary order-confirmation-link">View your orders</a>
    <a href="amazon.html" class="button-secondary order-confirmation-link" style="margin-top:8px;">Continue shopping</a>
  `;

  const main = document.querySelector(".main");
  if (main) main.prepend(banner);
}
