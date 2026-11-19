
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import MenuPage from "./components/features/menu/MenuPage";
import CartPage from "./components/features/cart/CartPage";
import FoodAssistant from "./components/features/ai/FoodAssistant";

import CheckoutPage from "./components/features/order/CheckoutPage";
import OrderSuccessPage from "./components/features/order/OrderSuccessPage";
import MyOrdersPage from "./components/features/order/MyOrdersPage";
import OrderTrackingPage from "./components/features/order/OrderTrackingPage";

function NotFoundPage() {
  return (
    <main className="container empty-cart">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  );
}

function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <div className="app-main">
          <Routes>
            <Route path="/" element={<MenuPage />} />

            <Route path="/cart" element={<CartPage />} />

            <Route
              path="/ai-assistant"
              element={<FoodAssistant />}
            />

            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            <Route
              path="/order-success/:orderId"
              element={<OrderSuccessPage />}
            />

            <Route
              path="/my-orders"
              element={<MyOrdersPage />}
            />

            <Route
              path="/track-order/:orderId"
              element={<OrderTrackingPage />}
            />

            <Route
              path="/home"
              element={<Navigate to="/" replace />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        <Footer />

        {assistantOpen ? (
          <aside
            className="floating-assistant"
            aria-label="AI food assistant"
          >
            <div className="floating-assistant-header">
              <strong>AI Food Assistant</strong>
              <button
                type="button"
                className="floating-assistant-close"
                aria-label="Close AI assistant"
                onClick={() => setAssistantOpen(false)}
              >
                ×
              </button>
            </div>
            <FoodAssistant floating />
          </aside>
        ) : (
          <button
            type="button"
            className="floating-assistant-button"
            aria-label="Open AI food assistant"
            onClick={() => setAssistantOpen(true)}
          >
            🤖
          </button>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
