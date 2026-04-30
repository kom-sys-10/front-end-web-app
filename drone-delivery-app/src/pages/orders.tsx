// Orders page: lists all orders for the logged-in user; clicking an order navigates to its status page.
import Order from "../models/order";
import "../styling/page-styling/orders-styling.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config";
import {
    FaBoxOpen,
    FaChevronRight,
    FaClock,
    FaMapMarkerAlt,
    FaPlane,
    FaReceipt
} from "react-icons/fa";

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrdersByUser = async () => {
            try {
                const uid = Number(localStorage.getItem("uid"));
                const response = await fetch(`${API_URL}/order/user-order/${uid}`);

                if (response.status === 200) {
                    const results = await response.json();
                    const tempOrders = results.map((item: any) =>
                        Order.fromJSON(item)
                    );
                    setOrders(tempOrders);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchOrdersByUser();
    }, []);

    return (
        <div className="orders-page">
            <div className="orders-hero">
                <h1>Your orders</h1>
                <p>Review previous purchases, check delivery progress, and open an order for full tracking details.</p>
            </div>

            <div className="orders-layout">
                <section className="orders-overview-card">
                    <div className="section-heading">
                        <h3>
                            <FaReceipt /> Order history
                        </h3>
                        <p>{orders.length} {orders.length === 1 ? "order" : "orders"} found in your account.</p>
                    </div>

                    <OrderList orders={orders} />
                </section>
            </div>
        </div>
    );
}

interface OrderListProps {
    orders: Order[];
}

function OrderList({ orders }: OrderListProps) {
    const navigate = useNavigate();

    const goToStatusPage = (oid: number | undefined) => {
        if (oid !== undefined) {
            navigate(`/status/${oid}`);
        }
    };

    if (orders.length === 0) {
        return (
            <div className="orders-empty-state">
                <FaBoxOpen />
                <h3>No orders yet</h3>
                <p>When you place your first order, it will appear here with delivery progress and details.</p>
            </div>
        );
    }

    return (
        <div className="orders-list">
            {orders.map((order) => (
                <button
                    key={order.getOid()}
                    className="order-card"
                    onClick={() => goToStatusPage(order.getOid())}
                    type="button"
                >
                    <div className="order-card-top">
                        <div>
                            <span className="order-card-label">Order number</span>
                            <h3>#{order.getOid()}</h3>
                        </div>

                        <div className="order-status-badge">
                            {order.getStatus()}
                        </div>
                    </div>

                    <div className="order-card-grid">
                        <div className="order-card-item">
                            <span>
                                <FaClock /> Order date
                            </span>
                            <p>{order.getDate()}</p>
                        </div>

                        <div className="order-card-item">
                            <span>
                                <FaPlane /> Delivery date
                            </span>
                            <p>{order.getDeliveryDate()}</p>
                        </div>

                        <div className="order-card-item full-width">
                            <span>
                                <FaMapMarkerAlt /> Delivery address
                            </span>
                            <p>{order.getAddress()}</p>
                        </div>
                    </div>

                    <div className="order-card-footer">
                        <div className="order-card-meta">
                            <span>Shipment type</span>
                            <p>{order.getShipmentType()}</p>
                        </div>

                        {order.getDroneId() !== undefined && (
                            <div className="order-card-meta">
                                <span>Drone ID</span>
                                <p>#{order.getDroneId()}</p>
                            </div>
                        )}

                        <div className="order-card-link">
                            View details <FaChevronRight />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default Orders;