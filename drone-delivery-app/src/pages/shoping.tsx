// Shopping page: fetches the full product catalog from the API and displays it as a list of cards.
import ShoppingItem from "../componments/shopping-item";
import Product from "../models/products";
import "../styling/page-styling/shopping.css";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { FaBoxOpen, FaStore } from "react-icons/fa";

function Shopping() {
    const [productsData, setProductsData] = useState<Product[]>([]);

    useEffect(() => {
        const getProductsData = async () => {
            try {
                const response = await fetch(`${API_URL}/product/`);
                const results = await response.json();
                const products = results.map((item: any) =>
                    Product.fromJSON(item)
                );

                setProductsData(products);
            } catch (error) {
                console.error(error);
            }
        };

        getProductsData();
    }, []);

    return (
        <div className="shopping-page">
            <div className="shopping-hero">
                <h1>Shopping</h1>
                <p>Discover products you'll love at Bamazone.</p>
            </div>

            <div className="shopping-layout">
                <section className="shopping-overview-card">
                    <div className="section-heading">
                        <h3>
                            <FaStore /> Product catalog
                        </h3>
                        <p>
                            {productsData.length}{" "}
                            {productsData.length === 1 ? "product" : "products"} available right now.
                        </p>
                    </div>

                    <ShoppingItemList items={productsData} />
                </section>
            </div>
        </div>
    );
}

interface ShoppingItemListProps {
    items: Product[];
}

function ShoppingItemList({ items }: ShoppingItemListProps) {
    if (items.length === 0) {
        return (
            <div className="shopping-empty-state">
                <FaBoxOpen />
                <h3>No products available</h3>
                <p>Please check back later for new items in the store.</p>
            </div>
        );
    }

    return (
        <ul className="shopping-list">
            {items.map((item) => (
                <li key={item.getPid()} className="shopping-list-item">
                    <ShoppingItem
                        name={item.getName()}
                        price={item.getPrice()}
                        description={item.getDescription()}
                        pid={item.getPid()}
                    />
                </li>
            ))}
        </ul>
    );
}

export default Shopping;