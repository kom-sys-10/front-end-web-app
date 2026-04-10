import ShoppingItem from "../componments/shopping-item";
import type { Product } from "../models/products";
import '../styling/page-styling/shopping.css';

function Shopping() {
    const items: Product[] = [
        { pid: 1, name: "Product 1", price: 100 },
        { pid: 2, name: "Product 2", price: 200 },
        { pid: 3, name: "Product 3", price: 300 },
        { pid: 4, name: "Product 4", price: 150 },
        { pid: 5, name: "Product 5", price: 250 },
        { pid: 6, name: "Product 6", price: 400 }
    ];

    return (
        <div className="shopping-page">
            <div className="shopping-hero">
                <h1>Shopping</h1>
                <p>Discover products you'll love at Bamazone.</p>
            </div>

            <ShoppingItemList items={items} />
        </div>
    );
}

function ShoppingItemList({ items }: ShoppingItemListProps) {
    return (
        <ul className="shopping-list">
            {items.map(item => (
                <li key={item.pid} className="shopping-list-item">
                    <ShoppingItem name={item.name} price={item.price} />
                </li>
            ))}
        </ul>
    );
}

interface ShoppingItemListProps {
    items: Product[];
}

export default Shopping;