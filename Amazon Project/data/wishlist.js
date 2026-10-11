export let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

export function addToWishlist(productId) {
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveWishlist();
    return true;
  }
  return false;
}

export function removeFromWishlist(productId) {
  wishlist = wishlist.filter((id) => id !== productId);
  saveWishlist();
}

export function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
