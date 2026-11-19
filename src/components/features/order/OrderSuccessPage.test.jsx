import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  createMemoryRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import OrderSuccessPage from "./OrderSuccessPage";
import { useOrderStore } from "./orderStore";

function TrackingPage() {
  const { orderId } = useParams();
  return <p>Tracking order: {orderId}</p>;
}

const savedOrder = {
  id: "ORD-TEST123",
  items: [],
  total: 15300,
  customer: { name: "Test Customer", phone: "9876543210", address: "Test Road" },
  status: "Order Placed",
  statusIndex: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
};

let container;
let root;

beforeEach(() => {
  vi.useFakeTimers();
  useOrderStore.setState({ orders: [savedOrder] });
  container = document.createElement("div");
  document.body.appendChild(container);

  const router = createMemoryRouter(
    [
      { path: "/order-success/:orderId", element: <OrderSuccessPage /> },
      { path: "/track-order/:orderId", element: <TrackingPage /> },
    ],
    { initialEntries: [`/order-success/${savedOrder.id}`] }
  );

  root = createRoot(container);
  act(() => root.render(<RouterProvider router={router} />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  useOrderStore.setState({ orders: [] });
  vi.useRealTimers();
});

describe("order success page", () => {
  test("shows the saved order and automatically opens tracking after five seconds", async () => {
    expect(container.textContent).toContain("Order Placed Successfully!");
    expect(container.textContent).toContain(savedOrder.id);
    expect(container.textContent).toContain("₹153.00");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(container.textContent).toContain(`Tracking order: ${savedOrder.id}`);
    expect(useOrderStore.getState().orders).toHaveLength(1);
  });

  test("the tracking button navigates immediately", () => {
    const button = container.querySelector("button");

    act(() => button.click());

    expect(container.textContent).toContain(`Tracking order: ${savedOrder.id}`);
    expect(useOrderStore.getState().orders).toHaveLength(1);
  });
});
