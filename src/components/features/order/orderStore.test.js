import { beforeEach, describe, expect, test } from "vitest";
import { orderStatuses, useOrderStore } from "./orderStore";

const activeOrder = {
  id: "ORD-ACTIVE",
  status: orderStatuses[3],
  statusIndex: 3,
};

beforeEach(() => {
  useOrderStore.setState({ orders: [{ ...activeOrder }] });
});

describe("order cancellation", () => {
  test("cancels an undelivered order and keeps it in history", () => {
    const cancelled = useOrderStore.getState().cancelOrder(activeOrder.id);
    const [order] = useOrderStore.getState().orders;

    expect(cancelled).toBe(true);
    expect(order.status).toBe("Cancelled");
    expect(order.cancelledAt).toBeTruthy();
    expect(useOrderStore.getState().orders).toHaveLength(1);
  });

  test("does not cancel an already delivered order", () => {
    useOrderStore.setState({
      orders: [{ ...activeOrder, status: orderStatuses[4], statusIndex: 4 }],
    });

    expect(useOrderStore.getState().cancelOrder(activeOrder.id)).toBe(false);
    expect(useOrderStore.getState().orders[0].status).toBe(orderStatuses[4]);
  });

  test("does not advance an order after it has been cancelled", () => {
    useOrderStore.getState().cancelOrder(activeOrder.id);
    useOrderStore.getState().updateOrderStatus(activeOrder.id, 4);

    expect(useOrderStore.getState().orders[0].status).toBe("Cancelled");
  });
});
