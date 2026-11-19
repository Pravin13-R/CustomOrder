export function validateCustomization(item, selection){
    const errors = [];
    if (!item?.customizations || !selection) {
        errors.push("Invalid customization.");
        return errors;
    }

    if (!item.customizations.sizes.some((size) => size.name === selection.size)) {
        errors.push("Please select a valid size.");
    }

    if (!item.customizations.spices.includes(selection.spice)) {
        errors.push("Please select a valid spice level.");
    }

    if (selection.toppings.length > item.customizations.maxToppings) {
        errors.push(`Choose up to ${item.customizations.maxToppings} toppings.`);
    }

    const validToppings = new Set(
        item.customizations.toppings.map((topping) => topping.name)
    );
    if (selection.toppings.some((name) => !validToppings.has(name))) {
        errors.push("One or more toppings are invalid.");
    }

    return errors;
}