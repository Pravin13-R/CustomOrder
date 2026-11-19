import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Price from "../../Price";
import { useOrderStore } from "./orderStore";
import "./OrderSuccessPage.css";

const redirectDelay = 5000;
const confettiColors = ["#f97316", "#22a06b", "#f5c542", "#ef476f", "#3b82f6"];
const confettiPieces = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  style: {
    "--confetti-left": `${(index * 37) % 100}%`,
    "--confetti-delay": `${(index % 12) * 0.17}s`,
    "--confetti-duration": `${3.2 + (index % 5) * 0.4}s`,
    "--confetti-drift": `${((index * 29) % 180) - 90}px`,
    "--confetti-rotation": `${(index * 71) % 360}deg`,
    "--confetti-color": confettiColors[index % confettiColors.length],
  },
}));

function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((state) =>
    state.orders.find((item) => item.id === orderId)
  );
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay / 1000);

  useEffect(() => {
    if (!order) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const redirectTimer = setTimeout(
      () => navigate(`/track-order/${order.id}`, { replace: true }),
      redirectDelay
    );
    const countdownTimer = setInterval(
      () => setSecondsLeft((seconds) => Math.max(0, seconds - 1)),
      1000
    );

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [navigate, order]);

  if (!order) {
    return (
      <main className="order-success-screen">
        <section className="order-success-card order-success-missing">
          <h1>Order not found</h1>
          <p>We couldn&apos;t find this order in your saved orders.</p>
          <Link to="/my-orders" className="order-success-button">
            View My Orders
          </Link>
        </section>
      </main>
    );
  }

  function trackOrder() {
    navigate(`/track-order/${order.id}`, { replace: true });
  }

  return (
    <main className="order-success-screen">
      <div className="success-confetti" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <span key={piece.id} style={piece.style} />
        ))}
      </div>

      <section className="order-success-card" aria-labelledby="success-title">
        <div className="success-checkmark" aria-hidden="true">
          <span className="success-checkmark-circle" />
          <span className="success-checkmark-mark" />
        </div>

        <p className="success-eyebrow">Thanks for ordering with CustomOrder</p>
        <h1 id="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Your delicious food is getting ready.
        </p>

        <div className="success-order-details">
          <div>
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div className="success-total">
            <span>Total amount</span>
            <strong>
              <Price amount={order.total} />
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="order-success-button"
          onClick={trackOrder}
        >
          Track Your Order
          <span aria-hidden="true">→</span>
        </button>

        <p className="success-redirect-note" aria-live="polite">
          Taking you to your order in {secondsLeft}{" "}
          {secondsLeft === 1 ? "second" : "seconds"}...
        </p>
        <div className="success-progress" aria-hidden="true">
          <span />
        </div>
      </section>
    </main>
  );
}

export default OrderSuccessPage;
