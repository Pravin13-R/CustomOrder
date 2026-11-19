import { create } from "zustand";
import { persist } from "zustand/middleware";

import { menuItems } from "../../../data/menu";
import { calculatePrice } from "../customization/calculatePrice";
import { validateCustomization } from "../customization/customizationRules";
import { getCartTotal } from "../../../utils/cartTotal";

export const orderStatuses = [
  "Order Placed",
  "Order Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

function createOrderId() {
  return `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

// Never trust prices saved in localStorage: rebuild each line from the menu.
function repriceItems(cartItems) {
  return cartItems.map((line) => {
    const menuItem = menuItems.find((m) => m.id === line.itemId);
    if (!menuItem) {
      throw new Error(`"${line.name}" is no longer available.`);
    }

    const errors = validateCustomization(menuItem, line.selection);
    if (errors.length > 0) {
      throw new Error(`${line.name}: ${errors[0]}`);
    }

    return {
      ...line,
      unitPrice: calculatePrice(menuItem, line.selection),
      selection: { ...line.selection, toppings: [...line.selection.toppings] },
    };
  });
}

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (cartItems, customer) => {
        if (!cartItems || cartItems.length === 0) {
          throw new Error("Your cart is empty.");
        }

        const items = repriceItems(cartItems);

        const newOrder = {
          id: createOrderId(),
          items,
          total: getCartTotal(items),
          customer: { ...customer },
          status: orderStatuses[0],
          statusIndex: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateOrderStatus: (orderId, nextStatusIndex) => {
        if (
          !Number.isInteger(nextStatusIndex) ||
          nextStatusIndex < 0 ||
          nextStatusIndex >= orderStatuses.length
        ) {
          return;
        }

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId && order.status !== "Cancelled"
              ? {
                  ...order,
                  statusIndex: nextStatusIndex,
                  status: orderStatuses[nextStatusIndex],
                }
              : order
          ),
        }));
      },

      cancelOrder: (orderId) => {
        const order = get().orders.find((item) => item.id === orderId);
        if (
          !order ||
          order.status === "Cancelled" ||
          order.statusIndex >= orderStatuses.length - 1
        ) {
          return false;
        }

        set((state) => ({
          orders: state.orders.map((item) =>
            item.id === orderId
              ? {
                  ...item,
                  status: "Cancelled",
                  cancelledAt: new Date().toISOString(),
                }
              : item
          ),
        }));
        return true;
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
    }),
    {
      name: "custom-order-orders",
      version: 1,
    }
  )
);