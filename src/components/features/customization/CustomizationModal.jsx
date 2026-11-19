import { useEffect, useRef, useState } from "react";

import Price from "../../Price";
import { validateCustomization } from "./customizationRules";
import { calculatePrice } from "./calculatePrice";
import { useCartStore } from "../cart/cartStore";


const CustomizationModal = ({
  item,
  onClose,
  initialSelection,
  onSubmit,
  submitLabel = "Add to Cart",
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { sizes, spices, toppings: toppingOptions, maxToppings } =
    item.customizations;

  const [size, setSize] = useState(initialSelection?.size ?? sizes[0].name);
  const [spice, setSpice] = useState(initialSelection?.spice ?? spices[0]);
  const [toppings, setToppings] = useState(initialSelection?.toppings ?? []);
  const [error, setError] = useState("");

  const selection = { size, spice, toppings };
  const atLimit = toppings.length >= maxToppings;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKeyDown = (e) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const toggleTopping = (name) => {
    setError("");
    setToppings((previous) => {
      if (previous.includes(name)) return previous.filter((t) => t !== name);
      if (previous.length >= maxToppings) return previous;
      return [...previous, name];
    });
  };

  let currentPrice = item.price;
  try {
    currentPrice = calculatePrice(item, selection);
  } catch {
    // keep base price
  }

  const handleSubmit = () => {
    const errors = validateCustomization(item, selection);
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const unitPrice = calculatePrice(item, selection);

    if (onSubmit) {
      onSubmit(selection, unitPrice);
    } else {
      addItem({
        itemId: item.id,
        name: item.name,
        image: item.image,
        selection,
        unitPrice,
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="custom-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="customize-title">Customize {item.name}</h2>
          <button
            type="button"
            className="close-btn"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <fieldset className="customization-section">
          <legend>Select Size</legend>
          {sizes.map((option) => (
            <label className="option" key={option.name}>
              <input
                type="radio"
                name="size"
                checked={size === option.name}
                onChange={() => {
                  setSize(option.name);
                  setError("");
                }}
              />
              <span>{option.name}</span>
              {option.price > 0 && <Price amount={option.price} />}
            </label>
          ))}
        </fieldset>

        {spices.length > 1 && (
          <section className="customization-section">
            <label htmlFor="spice">
              <h3>Select Spice Level</h3>
            </label>
            <select
              id="spice"
              value={spice}
              onChange={(e) => {
                setSpice(e.target.value);
                setError("");
              }}
            >
              {spices.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </section>
        )}

        <fieldset className="customization-section">
          <legend>Extra Toppings</legend>
          <p className="muted" aria-live="polite">
            {atLimit
              ? `Maximum ${maxToppings} toppings selected`
              : `Choose up to ${maxToppings} (${toppings.length} selected)`}
          </p>

          {toppingOptions.map((topping) => {
            const checked = toppings.includes(topping.name);
            return (
              <label className="option" key={topping.name}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!checked && atLimit}
                  onChange={() => toggleTopping(topping.name)}
                />
                <span>{topping.name}</span>
                <Price amount={topping.price} />
              </label>
            );
          })}
        </fieldset>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-footer">
          <div className="total-price">
            <p>Total Price</p>
            <Price amount={currentPrice} />
          </div>

          <button type="button" className="primary-btn" onClick={handleSubmit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;