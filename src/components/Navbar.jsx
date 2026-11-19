
import { Link } from "react-router-dom";
import { useCartStore } from "./features/cart/cartStore";

function Navbar() {
  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          CustomOrder 🍔
        </Link>

        <div className="nav-links">
          <Link to="/my-orders">My Orders</Link>
          <Link to="/cart" aria-label={`Cart, ${cartCount} items`}>
            <span aria-hidden="true">🛒</span>
            <span>Cart ({cartCount})</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
