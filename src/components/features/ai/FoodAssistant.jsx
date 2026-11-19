
import { useState } from "react";
import { menuItems } from "../../../data/menu";
import { useCartStore } from "../cart/cartStore";
import { formatMoney } from "../../../utils/formatMoney";

function FoodAssistant({ floating = false }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your food assistant. 🍔 What would you like to eat today?",
      items: [],
    },
  ]);

  const addItem = useCartStore((state) => state.addItem);

  function getRecommendations(input) {
    const query = input.toLowerCase();

    if (query.includes("spicy")) {
      return menuItems.filter(
        (item) =>
          item.customizations.spices.includes("Spicy")
      ).slice(0, 3);
    } else if (
      query.includes("vegetarian") ||
      query.includes("veg")
    ) {
      return menuItems.filter(
        (item) => item.category !== "Drinks"
      ).slice(0, 3);
    } else if (
      query.includes("drink") ||
      query.includes("milkshake")
    ) {
      return menuItems.filter(
        (item) => item.category === "Drinks"
      ).slice(0, 3);
    } else if (
      query.includes("cheap") ||
      query.includes("budget") ||
      query.includes("under")
    ) {
      return menuItems
        .filter((item) => item.price <= 15000)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
    } else if (
      query.includes("pizza")
    ) {
      return menuItems.filter(
        (item) => item.category === "Pizza"
      ).slice(0, 3);
    } else if (
      query.includes("burger")
    ) {
      return menuItems.filter(
        (item) => item.category === "Burgers"
      ).slice(0, 3);
    } else {
      return menuItems.filter((item) =>
        item.name.toLowerCase().includes(query)
      ).slice(0, 3);
    }
  }

  function handleSend() {
    const userMessage = message.trim();

    if (!userMessage) return;

    const recommendations = getRecommendations(userMessage);

    const assistantMessage = recommendations.length
      ? {
          role: "assistant",
          text: "Here are some food options I recommend for you! 😋",
          items: recommendations,
        }
      : {
          role: "assistant",
          text: "I couldn't find a matching item. Try asking for spicy food, pizza, burger, drinks, or budget-friendly food.",
          items: [],
        };

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userMessage, items: [] },
      assistantMessage,
    ]);

    setMessage("");
  }

  function handleAddToCart(item) {
    const selection = {
      size: item.customizations.sizes[0].name,
      spice: item.customizations.spices[0],
      toppings: [],
    };

    addItem({
      itemId: item.id,
      name: item.name,
      image: item.image,
      selection,
      unitPrice: item.price,
    });

    alert(`${item.name} added to your cart!`);
  }

  return (
    <div className={floating ? "ai-page floating-ai-page" : "ai-page container"}>
      {!floating && (
        <div className="ai-header">
          <h1>AI Food Assistant 🤖</h1>
          <p>Tell me what you are craving. I'll help you choose!</p>
        </div>
      )}

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.role}`}
            >
              <div className="message-bubble">
                {msg.text}
              </div>

              {msg.items.length > 0 && (
                <div className="ai-recommendations">
                  {msg.items.map((item) => (
                    <div
                      className="ai-food-card"
                      key={item.id}
                    >
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h3>{item.name}</h3>
                        <p>{formatMoney(item.price)}</p>

                        <button
                          className="primary-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            placeholder="Example: I want spicy food..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            className="primary-btn"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodAssistant;
