// Status page: shows the full delivery timeline and order details for a single order (:oid).
// Displays a maintenance alert banner if the assigned drone is flagged as under maintenance.
import { useParams } from "react-router-dom";
import Product from "../models/products";
import "../styling/page-styling/status-styling.css";
import { API_URL } from "../config";
import { useState, useEffect } from "react";
import Order from "../models/order";

import type { IconType } from "react-icons";
import {
    FaBoxOpen,
    FaClipboardCheck,
    FaBox,
    FaWarehouse,
    FaPlane,
    FaHome
} from "react-icons/fa";

interface TimelineStep {
    key: string;
    label: string;
    date: string;
    icon: IconType;
}

function Status() {
    const { oid } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!oid) return;

            try {
                const response = await fetch(`${API_URL}/order/${oid}`);

                if (response.status === 200) {
                    const result = await response.json();
                    const tempOrder = Order.fromJSON(result);
                    setOrder(tempOrder);
                } else {
                    console.error("Failed to fetch order");
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [oid]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!order) return;

            try {
                const tempProducts: Product[] = [];
                console.log("here")

                for (const pid of order.getPids()) {
                    const response = await fetch(`${API_URL}/product/${pid}`);
                    console.log(response.status);
                    if (response.status === 200) {
                        const result = await response.json();
                        tempProducts.push(Product.fromJSON(result));
                    }
                }

                setProducts(tempProducts);
            } catch (e) {
                console.error(e);
            }
        };

        fetchProducts();
    }, [order]);

    const getTimelineKeyFromStatus = (status: string): string => {
        const normalized = status.trim().toLowerCase();

        switch (normalized) {
            case "order placed":
                return "placed";
            case "order confirmed":
                return "confirmed";
            case "packing items":
                return "packing";
            case "ready for dispatch":
                return "dispatch";
            case "in drone transit":
                return "in-transit";
            case "delivered":
                return "delivered";
            default:
                return "placed";
        }
    };

    const orderDate = order?.getDate() ?? "-";
    const estimatedDelivery = order?.getDeliveryDate() ?? "-";
    const deliveryAddress = order?.getAddress() ?? "-";
    const paymentMethod = order?.getPaymentNumber() ?? "-";
    const packageWeight = order?.getPackageWeight() ?? 0;
    const shipmentType = order?.getShipmentType() ?? "-";
    const droneId = order?.getDroneId();
    const currentStatus = order?.getStatus() ?? "Order placed";
    const currentTimelineKey = getTimelineKeyFromStatus(currentStatus);
    const droneInMaintenance = order?.getDroneInMaintenance() ?? false;

    const timelineSteps: TimelineStep[] = [
        {
            key: "placed",
            label: "Order placed",
            date: orderDate,
            icon: FaBoxOpen
        },
        {
            key: "confirmed",
            label: "Order confirmed",
            date: "Status updated",
            icon: FaClipboardCheck
        },
        {
            key: "packing",
            label: "Packing items",
            date: "Status updated",
            icon: FaBox
        },
        {
            key: "dispatch",
            label: "Ready for dispatch",
            date: "Status updated",
            icon: FaWarehouse
        },
        {
            key: "in-transit",
            label: "In drone transit",
            date: "Status updated",
            icon: FaPlane
        },
        {
            key: "delivered",
            label: "Delivered",
            date: `Estimated: ${estimatedDelivery}`,
            icon: FaHome
        }
    ];

    const currentStepIndex = timelineSteps.findIndex(
        (step) => step.key === currentTimelineKey
    );

    const total = products.reduce((sum, product) => sum + product.getPrice(), 0);

    if (isLoading) {
        return (
            <div className="status-page">
                <div className="status-hero">
                    <h1>Order overview</h1>
                    <p>Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="status-page">
                <div className="status-hero">
                    <h1>Order overview</h1>
                    <p>Could not find this order.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="status-page">
            <div className="status-hero">
                <h1>Order overview</h1>
                <p>Track your delivery and review everything included in your order.</p>
            </div>

            {droneInMaintenance && (
                <div className="drone-alert-banner">
                    <strong>⚠️ Delivery disruption</strong>
                    <p>
                        Your assigned drone has encountered an issue and is under maintenance.
                        Your order may be delayed. We apologise for the inconvenience.
                    </p>
                </div>
            )}

            <div className="status-layout">
                <section className="status-summary-card">
                    <div className="status-summary-header">
                        <div>
                            <span className="status-label">Order number</span>
                            <h2>#{order.getOid()}</h2>
                        </div>

                        <div className="status-badge current">
                            {currentStatus}
                        </div>
                    </div>

                    <div className="status-summary-grid">
                        <div className="status-summary-item">
                            <span>Order date</span>
                            <p>{orderDate}</p>
                        </div>

                        <div className="status-summary-item">
                            <span>Estimated delivery</span>
                            <p>{estimatedDelivery}</p>
                        </div>

                        <div className="status-summary-item full-width">
                            <span>Delivery address</span>
                            <p>{deliveryAddress}</p>
                        </div>

                        <div className="status-summary-item full-width">
                            <span>Payment method</span>
                            <p>{paymentMethod}</p>
                        </div>
                    </div>
                </section>

                <section className="timeline-card">
                    <div className="section-heading">
                        <h3>Delivery timeline</h3>
                        <p>Follow every step from confirmation to final delivery.</p>
                    </div>

                    <div className="timeline-horizontal">
                        {timelineSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;

                            return (
                                <div className="timeline-step-wrapper" key={step.key}>
                                    <div className="timeline-step">
                                        <div
                                            className={`timeline-icon ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <div className="timeline-content">
                                            <h4>{step.label}</h4>
                                            <p>{step.date}</p>
                                        </div>
                                    </div>

                                    {index < timelineSteps.length - 1 && (
                                        <div
                                            className={`timeline-line ${index < currentStepIndex ? "completed" : ""}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="products-card">
                    <div className="section-heading">
                        <h3>Products in this order</h3>
                        <p>A quick overview of the items included in your delivery.</p>
                    </div>

                    <ul className="status-products-list">
                        {products.map((product) => (
                            <li key={product.getPid()} className="status-product-item">
                                <div className="status-product-info">
                                    <div className="status-product-image-placeholder">
                                        <span>📦</span>
                                    </div>

                                    <div>
                                        <h4>{product.getName()}</h4>
                                        <p>{product.getDescription()}</p>
                                    </div>
                                </div>

                                <div className="status-product-price">
                                    ${product.getPrice()}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="status-total-row">
                        <span>Total</span>
                        <strong>${total}</strong>
                    </div>
                </section>

                <section className="delivery-notes-card">
                    <div className="section-heading">
                        <h3>Delivery details</h3>
                        <p>Extra information about the shipment.</p>
                    </div>

                    <div className="delivery-notes-grid">
                        <div className="delivery-note-box">
                            <span>Shipment type</span>
                            <p>{shipmentType}</p>
                        </div>

                        <div className="delivery-note-box">
                            <span>Package weight</span>
                            <p>{packageWeight} kg</p>
                        </div>

                        {droneId !== undefined && (
                            <div className="delivery-note-box">
                                <span>Drone ID</span>
                                <p>#{droneId}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Status;