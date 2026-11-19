import { describe, expect, test } from "vitest";
import { calculatePrice } from "./calculatePrice";
import { validateCustomization } from "./customizationRules";
import { menuItems } from "../../../data/menu";

const burger = menuItems[0];
const selection = (overrides = {}) => ({
  size: "Regular",
  spice: "Mild",
  toppings: [],
  ...overrides,
});

describe("calculatePrice", () => {
  test("returns the base price", () => {
    expect(calculatePrice(burger, selection())).toBe(12900);
  });

  test("includes size and topping prices", () => {
    expect(
      calculatePrice(
        burger,
        selection({ size: "Large", toppings: ["Extra Cheese", "Onion"] })
      )
    ).toBe(12900 + 4000 + 2000 + 500);
  });

  test("throws for an invalid size", () => {
    expect(() => calculatePrice(burger, selection({ size: "XL" }))).toThrow();
  });

  test("throws for an invalid topping", () => {
    expect(() =>
      calculatePrice(burger, selection({ toppings: ["Gold"] }))
    ).toThrow();
  });
});

describe("validateCustomization", () => {
  test("returns no errors for a valid selection", () => {
    expect(validateCustomization(burger, selection())).toEqual([]);
  });

  test("rejects too many toppings", () => {
    const errors = validateCustomization(
      burger,
      selection({
        toppings: ["Extra Cheese", "Extra Patty", "Jalapeños", "Onion"],
      })
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  test("rejects an invalid spice level", () => {
    expect(
      validateCustomization(burger, selection({ spice: "Nuclear" })).length
    ).toBeGreaterThan(0);
  });
});
