
export const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    description: "Juicy vegetable patty with fresh lettuce, cheese and sauce.",
    price: 12900,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",

    customizations: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 4000 },
      ],

      spices: ["Mild", "Medium", "Spicy"],

      toppings: [
        { name: "Extra Cheese", price: 2000 },
        { name: "Extra Patty", price: 4000 },
        { name: "Jalapeños", price: 1000 },
        { name: "Onion", price: 500 },
      ],

      maxToppings: 3,
    },
  },

  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Classic pizza with mozzarella cheese and tomato sauce.",
    price: 19900,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",

    customizations: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Medium", price: 5000 },
        { name: "Large", price: 9000 },
      ],

      spices: ["Mild", "Medium", "Spicy"],

      toppings: [
        { name: "Extra Cheese", price: 2500 },
        { name: "Mushroom", price: 1500 },
        { name: "Olives", price: 1500 },
        { name: "Jalapeños", price: 1000 },
      ],

      maxToppings: 3,
    },
  },

  {
    id: 3,
    name: "French Fries",
    category: "Sides",
    description: "Crispy golden potato fries with seasoning.",
    price: 7900,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",

    customizations: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 3000 },
      ],

      spices: ["Mild", "Medium", "Spicy"],

      toppings: [
        { name: "Cheese Sauce", price: 1500 },
        { name: "Peri Peri", price: 1000 },
        { name: "Mayonnaise", price: 1000 },
      ],

      maxToppings: 2,
    },
  },

  {
    id: 4,
    name: "Chocolate Milkshake",
    category: "Drinks",
    description: "Creamy chocolate milkshake topped with chocolate syrup.",
    price: 9900,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600",

    customizations: {
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 3000 },
      ],

      spices: ["Mild"],

      toppings: [
        { name: "Chocolate Chips", price: 1000 },
        { name: "Whipped Cream", price: 1500 },
        { name: "Oreo", price: 2000 },
      ],

      maxToppings: 2,
    },
  },
];
