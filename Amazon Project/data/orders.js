import { cart } from "./cart.js";
import { getProduct } from "./products.js";
import { getDeliveryOption } from "./deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function generateOrderId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export let orders = JSON.parse(localStorage.getItem("orders")) || [];

export function saveOrder() {
  if (cart.length === 0) return null;

  const order = {
    id: generateOrderId(),
    datePlaced: dayjs().format("MMMM D, YYYY"),
    datePlacedTimestamp: Date.now(),
    products: cart.map((cartItem) => {
      const product = getProduct(cartItem.productId);
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      const deliveryDate = dayjs().add(deliveryOption.deliveryDays, "days");
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        deliveryOptionId: cartItem.deliveryOptionId,
        estimatedDelivery: deliveryDate.format("MMMM D, YYYY"),
        estimatedDeliveryTimestamp: deliveryDate.valueOf(),
        priceCents: product ? product.priceCents : 0,
        name: product ? product.name : "Unknown Product",
        image: product ? product.image : "",
      };
    }),
  };

  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  return order;
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

export function clearOrders() {
  orders = [];
  localStorage.removeItem("orders");
}
