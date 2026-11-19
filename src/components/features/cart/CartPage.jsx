import { useState } from "react";
import { Link } from "react-router-dom";

import { useCartStore } from "./cartStore";
import Price from "../../Price";
import CustomizationModal from "../customization/CustomizationModal";
import { menuItems } from "../../../data/menu";
import { getCartTotal } from "../../../utils/cartTotal";

function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const [editingId, setEditingId] = useState(null);

  const subtotal = getCartTotal(items);

  const editingLine = items.find((item) => item.id === editingId);
  const editingMenuItem = editingLine
    ? menuItems.find((m) => m.id === editingLine.itemId)
    : null;

  if (items.length === 0) {
    return (
      <main className="container empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some delicious food to get started.</p>
        <Link to="/" className="primary-btn">
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => {
            // Edit only if the menu item still exists
            const canEdit = menuItems.some((m) => m.id === item.itemId);

            return (
              <article className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>Size: {item.selection?.size || "Regular"}</p>
                  <p>Spice: {item.selection?.spice || "Mild"}</p>

                  {(item.selection?.toppings || []).length > 0 && (
                    <p>
                      Toppings: {item.selection.toppings.join(", ")}
                    </p>
                  )}

                  <p>
                    Unit price: <Price amount={item.unitPrice} />
                  </p>

                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => setEditingId(item.id)}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item-total">
                  <Price amount={item.unitPrice * item.quantity} />
                </div>
              </article>
            );
          })}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <Price amount={subtotal} />
          </div>

          <div className="summary-row">
            <strong>Total</strong>
            <strong>
              <Price amount={subtotal} />
            </strong>
          </div>

          <Link to="/checkout" className="primary-btn">
            Proceed to Checkout
          </Link>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </aside>
      </div>

      {editingLine && editingMenuItem && (
        <CustomizationModal
          key={editingLine.id}
          item={editingMenuItem}
          initialSelection={editingLine.selection}
          submitLabel="Update Item"
          onClose={() => setEditingId(null)}
          onSubmit={(selection, unitPrice) =>
            updateItem(editingLine.id, selection, unitPrice)
          }
        />
      )}
    </main>
  );
}

export default CartPage;