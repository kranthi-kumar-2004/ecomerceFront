import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/OrderDetails.css";

function OrderDetails() {
  const { state: order } = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  if (!order) {
    return (
      <div className="order-details">
        <h2>No Order Found</h2>
        <button onClick={() => navigate("/orders")} className="back-btn">
          Back
        </button>
      </div>
    );
  }

  /* ✅ Correct status */
  const status = order.delivery_status?.toUpperCase();

  /* ✅ Fetch address */
  useEffect(() => {
    if (!order?.address_id) return;

    fetch(`${API}/api/address/${order.address_id}`)
      .then((res) => res.json())
      .then((data) => setAddress(data))
      .catch((err) => console.error("Address fetch error:", err));
  }, [order]);

  /* ✅ Delivery date */
  const getDeliveryDate = () => {
    if (!order.order_date) return "N/A";
    const date = new Date(order.order_date);
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString();
  };

  const steps = ["PENDING", "PROCESSING", "SHIPPING", "DELIVERED"];

  const getProgress = () => {
    switch (status) {
      case "PENDING": return "0%";
      case "PROCESSING": return "33%";
      case "SHIPPING": return "66%";
      case "DELIVERED": return "100%";
      default: return "0%";
    }
  };

  return (
    <div className="order-details">

      {/* HEADER */}
      <div className="details-header">
        <h2>Order Details</h2>
        <button onClick={() => navigate("/orders")} className="back-btn">
          Back
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <div className="details-card">
        <div>
          <p className="label">Order ID</p>
          <h4>{order.order_id}</h4>

          <p className="date">
            {order.order_date
              ? new Date(order.order_date).toLocaleDateString()
              : "Recently placed"}
          </p>

          <p className="delivery-date">
            Expected Delivery: <b>{getDeliveryDate()}</b>
          </p>
        </div>

        <div className="right">
          <p className="label">Total</p>
          <h3>₹{order.total_price}</h3>
          <span className={`status ${status?.toLowerCase()}`}>
            {order.delivery_status}
          </span>
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="order-status-bar">
        <div className="progress-track"></div>
        <div className="progress-fill" style={{ width: getProgress() }}></div>

        {steps.map((step, i) => (
          <div key={i} className="step">
            <div
              className={`circle ${
                steps.indexOf(step) <= steps.indexOf(status) ? "active" : ""
              }`}
            >
              ✓
            </div>
            <p>{step.toLowerCase()}</p>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="details-products">
        <h3>Items</h3>

        {order.items.map((item, i) => (
          <div key={i} className="detail-item">
            <img src={item.productImage || "/default.png"} alt="" />

            <div className="info">
              <h4>{item.productName}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>
                Price: ₹{(order.total_price / order.items.length).toFixed(0)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY (DETAILED) */}
<div className="details-summary">
  <h3>Order Summary</h3>

  {order.items.map((item, i) => {
    const pricePerItem = order.total_price / order.items.length;
    const total = pricePerItem * item.quantity;

    return (
      <div key={i} className="summary-row">
        <span>{item.productName}</span>
        <span>
          ₹{pricePerItem.toFixed(0)} × {item.quantity} = ₹{total.toFixed(0)}
        </span>
      </div>
    );
  })}

  <hr />

  <div className="summary-total">
    <span>Total Amount</span>
    <b>₹{order.total_price}</b>
  </div>
</div>

      {/* PAYMENT */}
      {/* PAYMENT */}
<div className="details-payment">
  <h3>Payment Details</h3>

  <p>
    Mode:{" "}
    <b>
      {{
        COD: "Cash on Delivery",
        ONLINE: "Online Payment",
        UPI: "UPI",
        CARD: "Card"
      }[order.payment_mode?.toUpperCase()] ||
        order.payment_mode ||
        "N/A"}
    </b>
  </p>

  {/* ✅ Hide status if COD */}
  {order.payment_mode?.toUpperCase() !== "COD" && (
    <p>
      Status:{" "}
      <b className="payment-status">
        {order.payment_status || "Pending"}
      </b>
    </p>
  )}
</div>

      {/* ADDRESS */}
      <div className="details-address">
        <h3>Delivery Address</h3>

        {address ? (
          <div className="address-box">
            <p><b>{address.name}</b></p>
            <p>{address.landmark}, {address.area}</p>
            <p>{address.city}, {address.state}</p>
            <p>{address.pincode}</p>
            <p>📞 {address.phone}</p>
          </div>
        ) : (
          <p>Loading address...</p>
        )}
      </div>

    </div>
  );
}

export default OrderDetails;