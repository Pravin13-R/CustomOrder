import { useMemo, useState } from "react";
import { menuItems } from "../../../data/menu";
import MenuCard from "./MenuCard";

const MenuPage = () => {
    const categories = [
        "All",
        ...new Set(menuItems.map((item) => item.category)),
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredItems = useMemo(
        () => selectedCategory === "All"
            ? menuItems
            : menuItems.filter((item) => item.category === selectedCategory),
        [selectedCategory]
    );
  return (
    <div>
        <main className='container'>
            <section className='hero'>
                <span>FRESH FOOD. YOUR WAY.</span>
                <h1>Customize Your Food</h1>
                <p>
                     Choose your favorites and make them exactly
          how you like.
                </p>

            </section>

            <section className='section-heading'>
                <div className='section-heading'>
                    <h2>Our Menu</h2>
                <p>Explore our delicious food collection.</p>
                </div>

                <div className='categories'>
                    {categories.map((category) => (
                        <button key={category} type="button"
                        className={selectedCategory === category ? "active" : ""}
                        onClick={() => setSelectedCategory(category)}>
                            {category}

                        </button>
                    ))}

                </div>
                <div className='menu-grid'>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <MenuCard key = {item.id} item={item} />

                        
                        ))
                    ) :(
                        <p>No food items available.</p>
                    )
                }

                </div>

            </section>

        </main>
    </div>
  )
}

export default MenuPage