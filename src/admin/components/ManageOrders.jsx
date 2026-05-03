import { useEffect, useState } from "react";
import "./css/ManageOrders.css"

function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await fetch(API+"/api/orders");

            if (!res.ok) throw new Error("API failed");

            const data = await res.json();

            setOrders(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API}/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },

                // ✅ FIXED key name
                body: JSON.stringify({ deliveryStatus: status })
            });

            fetchOrders();
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    return (
        <div className="orders-container">
  <h2 className="orders-title">Manage Orders</h2>

  {loading && <p className="empty-text">Loading...</p>}

  {!loading && orders.length === 0 && (
    <p className="empty-text">No orders found</p>
  )}

  <table className="orders-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Change</th>
      </tr>
    </thead>

    <tbody>
      {orders.map((o) => (
        <tr key={o.id}>
          <td>ORD-{o.id}</td>
          <td>{o.userId || "N/A"}</td>
          <td>₹{o.totalPrice || 0}</td>

          {/* ✅ colored status */}
          <td>
  <span className={`status ${o.deliveryStatus}`}>
    {o.deliveryStatus}
  </span>
</td>

          <td>
            <select
              className="status-select"
              value={o.deliveryStatus || "Pending"}
              onChange={(e) =>
                updateStatus(o.id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipping">Shipping</option>
              <option value="Delivered">Delivered</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    );
}

export default ManageOrders;