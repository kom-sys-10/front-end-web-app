import { useRef, useState, useEffect } from "react";
import Product from "../models/products";
import "../styling/page-styling/payment-style.css";
import { useCart } from "../models/cart";
import { API_URL } from "../config";

import {
    FaBoxOpen,
    FaMapMarkerAlt,
    FaCreditCard,
    FaClock,
    FaPlane,
    FaCheckCircle
} from "react-icons/fa";
import Order from "../models/order";

function Payment() {
    const { cartItems, clearCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Visa ending in 4421");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [weatherOk, setWeatherOk] = useState<boolean | null>(null);
    const [droneAvailable, setDroneAvailable] = useState<boolean | null>(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(true);

    const subtotal = products.reduce((sum, product) => sum + product.getPrice(), 0);
    const deliveryFee = 19;
    const total = subtotal + deliveryFee;
    const estimatedDeliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toDateString();

    const hasFetchedAvailability = useRef(false);

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setFullName(name ?? "");
    }, []);

    useEffect(() => {
        if (hasFetchedAvailability.current) return;
        hasFetchedAvailability.current = true;

        const fetchCheckoutAvailability = async () => {
            try {
                setAvailabilityLoading(true);

                const response = await fetch(`${API_URL}/drone/checkout-availability`);
                if (!response.ok) {
                    throw new Error("Failed to fetch checkout availability");
                }

                const result = await response.json();
                console.log("Checkout availability:", result);

                setWeatherOk(result.weatherOk);
                setDroneAvailable(result.droneAvailable);
            } catch (e) {
                console.error("Failed to fetch checkout availability:", e);
                setWeatherOk(false);
                setDroneAvailable(false);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        fetchCheckoutAvailability();
    }, []);

    useEffect(() => {
        const fetchProductsFromCart = async () => {
            try {
                const tempProducts: Product[] = [];

                for (const pid of cartItems) {
                    const response = await fetch(`${API_URL}/product/${pid}`);
                    const result = await response.json();
                    tempProducts.push(Product.fromJSON(result));
                }

                setProducts(tempProducts);
            } catch (e) {
                console.error(e);
            }
        };

        fetchProductsFromCart();
    }, [cartItems]);

    const createOrder = async () => {
        const fullAddress = `${address}, ${postalCode} ${city}`;
        const uid = Number(localStorage.getItem("uid"));

        const order = new Order(
            undefined,
            uid,
            new Date().toDateString(),
            "Order confirmed",
            Math.round((Math.random() * (5 - 1) + 1) * 100) / 100,
            "Autonomous drone delivery",
            fullAddress,
            estimatedDeliveryDate,
            paymentMethod,
            cartItems
        ).toJSON();

        const response = await fetch(`${API_URL}/order/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        return response;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            !fullName.trim() ||
            !address.trim() ||
            !city.trim() ||
            !postalCode.trim() ||
            !paymentMethod.trim()
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (weatherOk === false) {
            alert("Drone delivery is currently unavailable because of weather conditions.");
            return;
        }

        if (droneAvailable === false) {
            alert("No drone is currently available for delivery.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await createOrder();

            if (response.status === 201) {
                clearCart();
                setProducts([]);
                alert("Order placed successfully!");
                return;
            }

            if (response.status === 409) {
                const errorData = await response.json();
                console.error("Order conflict:", errorData);

                if (errorData.weatherOk === false) {
                    setWeatherOk(false);
                    setDroneAvailable(false);
                    alert("Weather is no longer okay for drone delivery.");
                    return;
                }

                if (errorData.droneAvailable === false) {
                    setDroneAvailable(false);
                    alert("No drone is currently available anymore.");
                    return;
                }

                alert(errorData.msg || "Unable to place order.");
                return;
            }

            const errorText = await response.text();
            console.error("Failed to create order:", errorText);
            alert("Failed to place order.");
        } catch (e) {
            console.error(e);
            alert("Something went wrong while placing the order.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const renderShipmentText = () => {
        if (availabilityLoading) {
            return <p>Checking drone and weather availability...</p>;
        }

        if (weatherOk === false) {
            return <p>Standard delivery, weather is not suitable for drone delivery</p>;
        }

        if (droneAvailable === false) {
            return <p>Standard delivery, no drone currently available</p>;
        }

        if (weatherOk && droneAvailable) {
            return <p>Autonomous drone delivery is available</p>;
        }

        return <p>Standard delivery</p>;
    };

    return (
        <div className="create-order-page">
            <div className="create-order-hero">
                <h1>Create order</h1>
                <p>Review your items, choose delivery details, and place your drone delivery order.</p>
            </div>

            <div className="create-order-layout">
                <form className="checkout-form-card" onSubmit={handleSubmit}>
                    <section className="form-section">
                        <div className="section-heading">
                            <h3>
                                <FaMapMarkerAlt /> Delivery information
                            </h3>
                            <p>Enter where the drone delivery should arrive.</p>
                        </div>

                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label htmlFor="fullName">Full name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="input-group full-width">
                                <label htmlFor="address">Street address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Smørblomstvegen 31"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Trondheim"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="postalCode">Postal code</label>
                                <input
                                    id="postalCode"
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="7050"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-heading">
                            <h3>
                                <FaClock /> Delivery preferences
                            </h3>
                            <p>Select payment details and review delivery availability.</p>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label htmlFor="paymentMethod">Payment method</label>
                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option>Visa ending in 4421</option>
                                    <option>Mastercard ending in 8812</option>
                                    <option>PayPal</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-heading">
                            <h3>
                                <FaCreditCard /> Place order
                            </h3>
                            <p>Confirm your order and send it for drone dispatch.</p>
                        </div>

                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={
                                isSubmitting ||
                                availabilityLoading ||
                                weatherOk === false ||
                                droneAvailable === false
                            }
                        >
                            <FaCheckCircle />
                            {isSubmitting ? "Placing order..." : "Place order"}
                        </button>
                    </section>
                </form>

                <div className="order-sidebar">
                    <section className="order-summary-card">
                        <div className="section-heading">
                            <h3>
                                <FaBoxOpen /> Order summary
                            </h3>
                            <p>Review the items included in this order.</p>
                        </div>

                        <ul className="order-products-list">
                            {products.map((product) => (
                                <li key={product.getPid()} className="order-product-item">
                                    <div className="order-product-info">
                                        <div className="order-product-image-placeholder">
                                            <span>📦</span>
                                        </div>

                                        <div>
                                            <h4>{product.getName()}</h4>
                                            <p>{product.getDescription()}</p>
                                        </div>
                                    </div>

                                    <div className="order-product-price">
                                        ${product.getPrice()}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="price-breakdown">
                            <div>
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            <div>
                                <span>Drone delivery</span>
                                <span>${deliveryFee}</span>
                            </div>
                            <div className="price-total">
                                <span>Total</span>
                                <strong>${total}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="delivery-preview-card">
                        <div className="section-heading">
                            <h3>
                                <FaPlane /> Delivery preview
                            </h3>
                            <p>Your estimated drone delivery details.</p>
                        </div>

                        <div className="delivery-preview-grid">
                            <div className="delivery-preview-item">
                                <span>Estimated delivery date</span>
                                <p>{estimatedDeliveryDate}</p>
                            </div>

                            <div className="delivery-preview-item">
                                <span>Shipment type</span>
                                {renderShipmentText()}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Payment;