// Single source of truth for totals (all values in paise).
// Add tax, delivery fee and coupon logic here later.
export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
