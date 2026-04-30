// ShoppingItem component: card displaying a single product with name, price, description, and an "Add to cart" button.
import '../styling/componments-styling/shooping-item.css';
import { useCart } from '../models/cart';


function ShoppingItem({ name, price, description, pid }: ShoppingItemProps) {

    const { addToCartItems} = useCart();
    const onButtonClick = (pid: number) => {
        addToCartItems(pid);
    }
    return (
        <div className="shopping-item-card">
            <div className="shopping-item-image">
                <span>{name.charAt(0)}</span>
            </div>

            <div className="shopping-item-content">
                <h3>{name}</h3>
                <p className="shopping-item-subtitle">{description}</p>
                <p className="shopping-item-price">${price}</p>
                <button className="shopping-item-button" onClick={() => onButtonClick(pid)}>Add to cart</button>
            </div>
        </div>
    );
}

interface ShoppingItemProps {
    pid: number;
    name: string;
    price: number;
    description: string;
}

export default ShoppingItem;