import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import OrderTrackingPage from "./OrderTrackingPage";
import { useOrderStore } from "./orderStore";

const savedOrder = {
  id: "ORD-TRACK123",
  items: [
    {
      id: "ITEM-1",
      name: "Paneer Bowl",
      quantity: 2,
      unitPrice: 2500,
      selection: {
        size: "Regular",
        spice: "Medium",
        toppings: ["Corn"],
      },
    },
  ],
  total: 5000,
  customer: {
    name: "Test Customer",
    phone: "9876543210",
    address: "Test Road",
  },
  status: "Preparing",
  statusIndex: 2,
  createdAt: "2026-01-01T00:00:00.000Z",
};

let container;
let root;

function renderTrackingPage(orderId = savedOrder.id) {
  const router = createMemoryRouter(
    [{ path: "/track-order/:orderId", element: <OrderTrackingPage /> }],
    { initialEntries: [`/track-order/${orderId}`] }
  );

  root = createRoot(container);
  act(() => root.render(<RouterProvider router={router} />));
}

beforeEach(() => {
  useOrderStore.setState({ orders: [{ ...savedOrder }] });
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => root?.unmount());
  container.remove();
  useOrderStore.setState({ orders: [] });
});

describe("order tracking page", () => {
  test("shows order details and cancels an active order", () => {
    renderTrackingPage();

    expect(container.textContent).toContain(savedOrder.id);
    expect(container.textContent).toContain("Paneer Bowl × 2");
    expect(container.textContent).toContain("₹50.00");

    const cancelButton = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Cancel Order"
    );

    act(() => cancelButton.click());
    const confirmButton = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Yes, Cancel Order"
    );
    act(() => confirmButton.click());

    expect(container.textContent).toContain("Order Cancelled");
    expect(useOrderStore.getState().orders[0].status).toBe("Cancelled");
  });

  test("shows an empty state for unknown orders", () => {
    renderTrackingPage("ORD-MISSING");

    expect(container.textContent).toContain("Order Not Found");
    expect(container.textContent).toContain("Back to Menu");
  });
});
