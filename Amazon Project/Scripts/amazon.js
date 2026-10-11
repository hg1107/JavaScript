import { cart, addToCart, getCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../data/wishlist.js";

// ── Cart quantity header ─────────────────────────────────────────────────────
function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML = getCartQuantity();
}
updateCartQuantity();

// ── Toast notification ───────────────────────────────────────────────────────
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector(".js-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast js-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("toast-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("toast-visible"), 2500);
}

// ── Render products ──────────────────────────────────────────────────────────
function renderProducts(productList) {
  let productsHTML = "";

  productList.forEach((product) => {
    const wishlisted = isInWishlist(product.id);
    productsHTML += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <button class="wishlist-btn js-wishlist-btn ${wishlisted ? "wishlisted" : ""}"
            data-product-id="${product.id}"
            title="${wishlisted ? "Remove from wishlist" : "Add to wishlist"}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <img class="product-image" src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-name limit-text-to-2-lines">${product.name}</div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png"
            alt="${product.rating.stars} stars">
          <div class="product-rating-count link-primary">${product.rating.count.toLocaleString()}</div>
        </div>

        <div class="product-price">$${formatCurrency(product.priceCents)}</div>

        <div class="product-quantity-container">
          <label class="quantity-label" for="qty-${product.id}">Qty:</label>
          <select id="qty-${product.id}" class="js-quantity-selector">
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n}</option>`).join("")}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png" alt="Added"> Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML =
    productList.length === 0
      ? `<div class="no-results">No products found. <span class="link-primary js-clear-search" style="cursor:pointer">Clear search</span></div>`
      : productsHTML;

  attachProductListeners();
}

// ── Event listeners on products ──────────────────────────────────────────────
function attachProductListeners() {
  // Add to Cart
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const qtySelect = document.querySelector(`#qty-${productId}`);
      const qty = qtySelect ? parseInt(qtySelect.value) : 1;
      addToCart(productId, qty);
      updateCartQuantity();

      // "Added" flash
      const addedMsg = document.querySelector(`.js-added-to-cart-${productId}`);
      if (addedMsg) {
        addedMsg.style.opacity = "1";
        setTimeout(() => { addedMsg.style.opacity = "0"; }, 2000);
      }

      const product = products.find(p => p.id === productId);
      showToast(`✓ ${product ? product.name.slice(0, 30) + "…" : "Item"} added to cart`);
    });
  });

  // Wishlist toggle
  document.querySelectorAll(".js-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        btn.classList.remove("wishlisted");
        btn.title = "Add to wishlist";
        showToast("Removed from wishlist");
      } else {
        addToWishlist(productId);
        btn.classList.add("wishlisted");
        btn.title = "Remove from wishlist";
        showToast("❤ Added to wishlist");
      }
    });
  });

  // Clear search (no results state)
  const clearBtn = document.querySelector(".js-clear-search");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const searchBar = document.querySelector(".js-search-bar");
      if (searchBar) searchBar.value = "";
      renderProducts(products);
      updateSortControls(products);
    });
  }
}

// ── Search & filter ──────────────────────────────────────────────────────────
let currentSort = "default";

function getFilteredProducts(query) {
  if (!query) return [...products];
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
  );
}

function getSortedProducts(list) {
  if (currentSort === "price-asc") return [...list].sort((a, b) => a.priceCents - b.priceCents);
  if (currentSort === "price-desc") return [...list].sort((a, b) => b.priceCents - a.priceCents);
  if (currentSort === "rating") return [...list].sort((a, b) => b.rating.stars - a.rating.stars || b.rating.count - a.rating.count);
  return list;
}

function updateSortControls(list) {
  const countEl = document.querySelector(".js-results-count");
  if (countEl) countEl.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;
}

function doSearch() {
  const query = document.querySelector(".js-search-bar")?.value.trim() || "";
  const filtered = getFilteredProducts(query);
  const sorted = getSortedProducts(filtered);
  renderProducts(sorted);
  updateSortControls(sorted);
}

// Initial render
renderProducts(products);
updateSortControls(products);

// Search bar (header)
const searchBar = document.querySelector(".search-bar");
if (searchBar) {
  searchBar.classList.add("js-search-bar");
  searchBar.addEventListener("input", doSearch);
  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });
}

const searchBtn = document.querySelector(".search-button");
if (searchBtn) searchBtn.addEventListener("click", doSearch);

// Sort controls (injected below header)
const sortContainer = document.querySelector(".js-sort-container");
if (sortContainer) {
  sortContainer.addEventListener("change", (e) => {
    if (e.target.matches(".js-sort-select")) {
      currentSort = e.target.value;
      doSearch();
    }
  });
}
