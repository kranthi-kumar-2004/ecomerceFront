import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const location = useLocation();
  const navigate = useNavigate();

  const normalize = (s) => (s || "").toUpperCase();

  const showToast = (message) => {
    setToast({ show: true, msg: message });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  /* ✅ Show payment success toast */
  useEffect(() => {
    if (location.state?.success) {
      showToast("Payment Successful");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* ✅ Fetch orders */
  useEffect(() => {
    fetch(API + "/api/checkout/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
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
        orders.map((order) => (
          <div key={order.order_id} className="order-card">

            {/* HEADER */}
            <div className="order-header">
              <div>
                <p className="order-id">Order ID</p>
                <h4>{order.order_id}</h4>

                <p className="date">
                  {order.order_date
                    ? (() => {
                        const d = new Date(order.order_date);
                        d.setDate(d.getDate() + 2);
                        return "Delivery by " + d.toLocaleDateString();
                      })()
                    : "Delivery soon"}
                </p>
              </div>

              <div className="order-right">
                <p>Total</p>
                <h3 className="total">₹{order.total_price}</h3>

                <span
                  className={`status ${normalize(order.delivery_status).toLowerCase()}`}
                >
                  {order.delivery_status}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="order-body">
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

                {/* VIEW DETAILS BUTTON */}
                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/order/${order.order_id}`, { state: order })
                  }
                >
                  View Details
                </button>

              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;