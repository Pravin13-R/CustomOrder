import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useCartStore } from "../cart/cartStore";
import { useOrderStore } from "./orderStore";
import { getCartTotal } from "../../../utils/cartTotal";
import Price from "../../Price";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const submissionLock = useRef(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getCartTotal(items);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    // phone: digits only
    const next = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setCustomer((previous) => ({ ...previous, [name]: next }));
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    if (submissionLock.current) return;
    setError("");

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setError("Please fill in all delivery details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    try {
      const order = placeOrder(items, {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
      });

      navigate(`/order-success/${order.id}`, { replace: true });
      clearCart();
    } catch (err) {
      setError(err.message || "Unable to place your order.");
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container checkout-page">
      <h1>Checkout</h1>
      <p>Enter your delivery details to place your order.</p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Delivery Details</h2>

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={customer.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Mobile Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={customer.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="address">Delivery Address</label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter your complete address"
            rows={4}
            value={customer.address}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <Price amount={item.unitPrice * item.quantity} />
            </div>
          ))}

          <hr />

          <div className="summary-row">
            <strong>Total</strong>
            <strong>
              <Price amount={total} />
            </strong>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;