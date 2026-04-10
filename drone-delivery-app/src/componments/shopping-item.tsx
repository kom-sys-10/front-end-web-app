import '../styling/componments-styling/shooping-item.css';

function ShoppingItem({ name, price }: ShoppingItemProps) {
    return (
        <div className="shopping-item-card">
            <div className="shopping-item-image">
                <span>{name.charAt(0)}</span>
            </div>

            <div className="shopping-item-content">
                <h3>{name}</h3>
                <p className="shopping-item-subtitle">Premium everyday product</p>
                <p className="shopping-item-price">${price}</p>
                <button className="shopping-item-button">Add to cart</button>
            </div>
        </div>
    );
}

interface ShoppingItemProps {
    name: string;
    price: number;
}

export default ShoppingItem;