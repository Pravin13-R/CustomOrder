export function calculatePrice(item, selection) {
    const selectedSize = item.customizations.sizes.find(
        (size) => size.name === selection.size
    );

    if (!selectedSize) {
        throw new Error("Invalid size selected.");
    }

    const selectedToppings = selection.toppings.map(
        (name) => {
            const toppings = item.customizations.toppings.find(
                (option) => option.name === name
            );

            if (!toppings) {
                throw new Error(`Invalid toppings: ${name}`);
            }
            return toppings.price;
        }
    );

    const toppingsTotal = selectedToppings.reduce(
        (total,price) => total + price,
        0
    );

    const totalPrice =
    item.price +
    selectedSize.price +
    toppingsTotal;

    return totalPrice;
}