import { useState } from "react";
import Price from "../../Price";
import CustomizationModal from "../customization/CustomizationModal";

const MenuCard = ({ item }) => {

    const [showModal, setShowModal] = useState(false);

  return (
    <>
    <div className='menu-card'>
        <div className='menu-card-image'>
            <img src={item.image} alt={item.name} loading="lazy" decoding="async" />

        </div>

        <div className='menu-card-content'>
            <span className='category'>{item.category}</span>
            <h3>{item.name}</h3>
            <p>{item.description}</p>

            <div className='card-footer'>
                <Price amount={item.price} />
                <button type="button" className='primary-btn' onClick={() => setShowModal(true)}>
                    Customize

                </button>

            </div>
        </div>

    </div>

    {showModal && (
        <CustomizationModal item={item} onClose={() => setShowModal(false)} />
    )}
    </>
  )
}

export default MenuCard