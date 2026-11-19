
import { Link } from "react-router-dom";
import { useOrderStore } from "./orderStore";
import Price from "../../Price";

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <h3>{order.id}</h3>
          <p>{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>

        <span className={`order-status-badge ${order.status === "Cancelled" ? "cancelled" : ""}`}>
          {order.status}
        </span>
      </div>

      <div className="order-card-items">
        {order.items.map((item, index) => (
          <div key={`${item.itemId}-${index}`}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <Price amount={item.unitPrice * item.quantity} />
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <div>
          <span>Total Amount</span>
          <Price amount={order.total} />
        </div>

        <Link to={`/track-order/${order.id}`} className="track-order-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

function MyOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const activeOrders = orders.filter((order) => order.status !== "Cancelled");
  const cancelledOrders = orders.filter((order) => order.status === "Cancelled");

  if (orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/" className="primary-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-heading">
        <h1>My Orders</h1>
        <p>Track and manage your previous orders.</p>
      </div>

      {activeOrders.length > 0 && (
        <section className="order-group" aria-labelledby="active-orders-heading">
          <h2 className="order-group-heading" id="active-orders-heading">
            Orders
          </h2>
          <div className="orders-list">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {cancelledOrders.length > 0 && (
        <section
          className="order-group cancelled-order-group"
          aria-labelledby="cancelled-orders-heading"
        >
          <h2 className="order-group-heading" id="cancelled-orders-heading">
            Cancelled Orders
          </h2>
          <div className="orders-list">
            {cancelledOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyOrdersPage;
