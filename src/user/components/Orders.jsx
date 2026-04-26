import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./css/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const location = useLocation();

  const [toast, setToast] = useState({ show: false, msg: "" });

  const steps = ["PENDING", "PROCESSING", "SHIPPING", "DELIVERED"];

  const normalize = (s) => (s || "").toUpperCase();

  const getStatusTitle = (status) => {
    const s = normalize(status);
    switch (s) {
      case "PENDING": return "Order Placed";
      case "PROCESSING": return "Processing Order";
      case "SHIPPING": return "Out for Delivery";
      case "DELIVERED": return "Delivered Successfully";
      default: return status;
    }
  };

  const getStatusMessage = (status) => {
    const s = normalize(status);
    switch (s) {
      case "PENDING": return "Your order has been placed successfully.";
      case "PROCESSING": return "We are preparing your order.";
      case "SHIPPING": return "Your order is on the way.";
      case "DELIVERED": return "We hope you enjoy your purchase!";
      default: return "";
    }
  };

  const isActive = (step, current) => {
    return steps.indexOf(step) <= steps.indexOf(normalize(current));
  };

  // 🔥 PERFECT WIDTH ALIGNMENT
  const getProgressWidth = (status) => {
    const s = (status || "").toUpperCase(); // 🔥 important

    switch (s) {
      case "PENDING": return 0;
      case "PROCESSING": return 33;
      case "SHIPPING": return 66;
      case "DELIVERED": return 100;
      default: return 0;
    }
  };

  const showToast = (message) => {
    setToast({ show: true, msg: message });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  useEffect(() => {
    if (location.state?.success) {
      showToast("Payment Successful");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetch("http://localhost:8080/api/checkout/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders([...data].reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <h2 className="orders-loading">Loading Orders...</h2>;

  return (
    <div className="orders-container">
      {toast.show && <div className="toast">{toast.msg}</div>}

      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order.orderId} className="order-card">

            {/* HEADER */}
            <div className="order-header">
              <div>
                <p className="order-id">Order ID</p>
                <h4>{order.orderId}</h4>
                <p className="date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "Placed recently"}
                </p>
              </div>

              <div className="order-right">
                <p>Total</p>
                <h3 className="total">₹{order.totalPrice}</h3>
                <span className={`status ${normalize(order.status).toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="order-body">

              {/* LEFT */}
              <div className="order-items-left">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.productImage || "/default.png"} alt="" />
                    <div>
                      <p>{item.productName}</p>
                      <small>Qty: {item.quantity}</small>
                    </div>
                  </div>
                ))}
                <button className="view-btn">View Details</button>
              </div>

              {/* RIGHT */}
              <div className="order-status-box">
                <h4>{getStatusTitle(order.status)}</h4>


                <div
                  className="progress-bar"
                  style={{ "--progress": getProgressWidth(order.status) }}
                >
                  {steps.map((step, i) => (
                    <div key={i} className="step">
                      <div className={`circle ${isActive(step, order.status) ? "active" : ""}`}>
                        ✓
                      </div>
                      <p>{step.toLowerCase()}</p>
                    </div>
                  ))}
                </div>
                <p className="delivery-msg">{getStatusMessage(order.status)}</p>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
