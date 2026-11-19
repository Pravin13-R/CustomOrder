import { beforeEach, describe, expect, test } from "vitest";
import { useCartStore } from "./cartStore";

const base = (selection) => ({
  itemId: 1,
  name: "Classic Burger",
  image: "x.jpg",
  unitPrice: 12900,
  selection,
});

const sel = (over = {}) => ({
  size: "Regular",
  spice: "Mild",
  toppings: [],
  ...over,
});

beforeEach(() => useCartStore.setState({ items: [] }));

describe("cart store", () => {
  test("same customization (toppings in any order) merges into one line", () => {
    const { addItem } = useCartStore.getState();
    addItem(base(sel({ toppings: ["Onion", "Extra Cheese"] })));
    addItem(base(sel({ toppings: ["Extra Cheese", "Onion"] })));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  test("different customization stays a separate line", () => {
    const { addItem } = useCartStore.getState();
    addItem(base(sel()));
    addItem(base(sel({ size: "Large" })));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  test("updateQuantity to 0 removes the line", () => {
    useCartStore.getState().addItem(base(sel()));
    const id = useCartStore.getState().items[0].id;
    useCartStore.getState().updateQuantity(id, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test("updateItem changes selection and price in place", () => {
    useCartStore.getState().addItem(base(sel()));
    const id = useCartStore.getState().items[0].id;
    useCartStore.getState().updateItem(id, sel({ size: "Large" }), 16900);

    const [line] = useCartStore.getState().items;
    expect(line.selection.size).toBe("Large");
    expect(line.unitPrice).toBe(16900);
  });

  test("editing a line into an existing customization merges quantities", () => {
    const { addItem } = useCartStore.getState();
    addItem(base(sel()));
    addItem(base(sel()));
    addItem(base(sel({ size: "Large" })));

    const large = useCartStore
      .getState()
      .items.find((item) => item.selection.size === "Large");
    useCartStore.getState().updateItem(large.id, sel(), 12900);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });
});
