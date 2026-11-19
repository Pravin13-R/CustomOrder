import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link to="/" className="site-footer-logo">
              CustomOrder <span aria-hidden="true">🍔</span>
            </Link>
            <p>Good food, made just the way you like it.</p>
          </div>

          <nav className="site-footer-links" aria-label="Footer navigation">
            <Link to="/">Menu</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </nav>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} CustomOrder. All rights reserved.</p>
          <p>Made for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
