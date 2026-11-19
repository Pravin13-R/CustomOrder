
import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useOrderStore, orderStatuses } from "./orderStore";

import Price from "../../Price";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
});

function formatOrderDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not available" : dateFormatter.format(date);
}

function OrderTrackingPage(){
    const {orderId} = useParams();

    const order = useOrderStore((state) => 
    state.orders.find((item) => item.id === orderId)
    );
    const cancelOrder = useOrderStore((state) => state.cancelOrder);
    const [confirmingCancellation, setConfirmingCancellation] = useState(false);
    const [cancelError, setCancelError] = useState("");
    const statusIndex = order && Number.isInteger(order.statusIndex)
        ? Math.min(Math.max(order.statusIndex, 0), orderStatuses.length - 1)
        : 0;
    const createdAtLabel = useMemo(
        () => formatOrderDate(order?.createdAt),
        [order?.createdAt]
    );
    const cancelledAtLabel = useMemo(
        () => formatOrderDate(order?.cancelledAt),
        [order?.cancelledAt]
    );
    const canCancel = Boolean(
        order &&
        order.status !== "Cancelled" &&
        statusIndex < orderStatuses.length - 1
    );
    const items = Array.isArray(order?.items) ? order.items : [];

    const handleConfirmCancellation = useCallback(() => {
        if (!order) return;

        const cancelled = cancelOrder(order.id);
        setConfirmingCancellation(false);
        setCancelError(cancelled ? "" : "This order can no longer be cancelled.");
    }, [cancelOrder, order]);

    const openCancellationConfirmation = useCallback(() => {
        setCancelError("");
        setConfirmingCancellation(true);
    }, []);

    if (!order){
        return(
            <main className="container empty-cart">
                <h2>Order Not Found</h2>
                  <p>We couldn't find an order with this ID.</p>

                   <Link to="/" className="primary-btn">
          Back to Menu
        </Link>

            </main>
        );
    }

    return(
        <main className="container tracking-page">
            <div className="tracking-header">
                <div>
                    <h1>Track Your Order 📦</h1>
                    <p>Your order is being processed.</p>
                </div>
                <span className={`order-status ${order.status === "Cancelled" ? "cancelled" : ""}`}>
                    {order.status}
                </span>

            </div>

            <section className="order-info">
                <div>
                    <span>Order ID</span>
                    <strong>{order.id}</strong>
                </div>

                <div>
                    <span>Order Date</span>
                    <strong>{createdAtLabel}</strong>
                </div>

            </section>

            {order.status === "Cancelled" ? (
                <section className="tracking-card cancellation-notice" role="status">
                    <h2>Order Cancelled</h2>
                    <p>
                        {order.cancelledAt
                            ? `Cancelled on ${cancelledAtLabel}.`
                            : "This order has been cancelled."}
                    </p>
                </section>
            ) : (
                <section className="tracking-card">
                    <h2>Delivery Progress</h2>
                    <div className="tracking-timeline">
                        {orderStatuses.map((status,index) => {
                            const completed = index <= statusIndex;
                            const current = index === statusIndex;

                            return(
                                <div key={status}
                                    className={`tracking-step ${
                                        completed ? "completed" : ""
                                    } ${current ? "current" : ""}`}
                                >
                                    <div className="tracking-marker">
                                        {completed ? "✓" : index + 1}
                                    </div>
                                    <div className="tracking-step-content">
                                        <h3>{status}</h3>
                                        <p>
                                            {current
                                                ? "Current order status"
                                                : completed
                                                    ? "Completed"
                                                    : "Waiting"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {canCancel && (
                <section className="tracking-card cancel-order-card">
                    <h2>Need to cancel?</h2>
                    {!confirmingCancellation ? (
                        <>
                            <p>You can cancel this order any time before it is delivered.</p>
                            <button
                                type="button"
                                className="cancel-order-btn"
                                onClick={openCancellationConfirmation}
                            >
                                Cancel Order
                            </button>
                        </>
                    ) : (
                        <div className="cancel-confirmation" role="group" aria-label="Confirm order cancellation">
                            <p>Are you sure you want to cancel this order?</p>
                            <div className="cancel-confirmation-actions">
                                <button
                                    type="button"
                                    className="keep-order-btn"
                                    onClick={() => setConfirmingCancellation(false)}
                                >
                                    Keep Order
                                </button>
                                <button
                                    type="button"
                                    className="confirm-cancel-btn"
                                    onClick={handleConfirmCancellation}
                                >
                                    Yes, Cancel Order
                                </button>
                            </div>
                        </div>
                    )}
                    {cancelError && <p className="error" role="alert">{cancelError}</p>}
                </section>
            )}

            <section className="tracking-card">
                <h2>Delivery Details</h2>
                <p>
                     <strong>Name:</strong>{" "}
          {order.customer?.name || "Not available"}
                </p>

                 <p>
          <strong>Phone:</strong>{" "}
          {order.customer?.phone || "Not available"}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {order.customer?.address || "Not available"}
        </p>

            </section>

            <section className="tracking-card">
        <h2>Ordered Items</h2>

        {items.map((item) => (
          <div className="tracking-item" key={item.id}>
            <div>
              <h3>{item.name} × {item.quantity}</h3>

              <p>Size: {item.selection?.size || "Not available"}</p>
              <p>Spice: {item.selection?.spice || "Not available"}</p>

              {(item.selection?.toppings?.length ?? 0) > 0 && (
                <p>
                  Toppings: {item.selection.toppings.join(", ")}
                </p>
              )}
            </div>

            <Price
              amount={item.unitPrice * item.quantity}
            />
          </div>
        ))}

        <div className="tracking-total">
          <strong>Order Total</strong>
          <strong>
            <Price amount={order.total} />
          </strong>
        </div>
      </section>

      <Link to="/" className="primary-btn">
        Continue Shopping
      </Link>

        </main>
    )



}

export default OrderTrackingPage;