import { create } from "zustand";
import { persist } from "zustand/middleware";

// Identity of a cart line = item + size + spice + toppings (order-independent)
export function getLineKey(itemId, selection) {
  const toppings = [...(selection?.toppings || [])].sort().join(",");
  return `${itemId}|${selection?.size || ""}|${selection?.spice || ""}|${toppings}`;
}

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const key = getLineKey(newItem.itemId, newItem.selection);
          const existing = state.items.find(
            (item) => getLineKey(item.itemId, item.selection) === key
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...newItem, id: crypto.randomUUID(), quantity: 1 },
            ],
          };
        }),

      // Edit a line's customization. If the new customization equals another
      // existing line, merge the two lines (quantities add up).
      updateItem: (id, selection, unitPrice) =>
        set((state) => {
          const target = state.items.find((item) => item.id === id);
          if (!target) return state;

          const key = getLineKey(target.itemId, selection);
          const duplicate = state.items.find(
            (item) =>
              item.id !== id && getLineKey(item.itemId, item.selection) === key
          );

          if (duplicate) {
            return {
              items: state.items
                .filter((item) => item.id !== id)
                .map((item) =>
                  item.id === duplicate.id
                    ? { ...item, quantity: item.quantity + target.quantity }
                    : item
                ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, selection, unitPrice } : item
            ),
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "custom-order-cart", version: 1 }
  )
);