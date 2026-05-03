import "./css/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUsers, FaShoppingCart, FaRupeeSign, FaBoxOpen } from "react-icons/fa";

function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(0);
    const [products, setProducts] = useState(0);
    const [totalO, setTotalO] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(API+"/api/dashboard");
            const data = await res.json();

            console.log("API DATA:", data);

            setUsers(data.users);
            setProducts(data.products);
            setTotalO(data.totalOrders);
            setRevenue(data.totalRevenue);

            // ✅ ADD THIS
            setRecentOrders(data.recentOrders || []);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    return (<div className="dash">
        <h2>Admin Dashboard</h2>
        <div className="display-content" >
            <div className="box">
                <div className="inbox">
                    <h5>Total Users</h5>
                    <span>{users}</span>
                </div>
                <FaUsers className="icon-users" />
            </div>
            <div className="box">
                <div className="inbox">
                    <h5>Total Products</h5>
                    <span>{products}</span>
                </div>
                <FaBoxOpen className="icon-products" />

            </div>
            <div className="box" onClick={() => navigate("/admin/orders-chart")}>
                <div className="inbox">
                    <h5>Total Orders</h5>
                    <span>{totalO}</span>
                </div>
                <FaShoppingCart className="icon-orders" />
            </div>
            <div className="box" onClick={() => navigate("/admin/revenue-chart")}>
                <div className="inbox">
                    <h5>Total Revenue</h5>
                    <span>{formatCurrency(revenue)}</span>
                </div>
                <FaRupeeSign className="icon-revenue" />
            </div>
        </div>
        <div className="RQ">
            <div className="Quick">
                <h4>Quick Actions</h4>
                <Link className="manage-p" to="/admin/manage">Manage Product</Link>
                <Link to="/admin/manage-orders">Manage Orders</Link>
                <Link to="/admin/manage-users">Manage Users</Link>
                <Link to="/admin/manage">Manage Staff</Link>
            </div>
            <div className="Recent">
                <h4>Recent Orders</h4>
                {recentOrders.length === 0 ? (
                    <label>No recent Orders</label>
                ) : (
                    <table className="recent-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>ORD-{order.id}</td>
                                    <td>{order.user_id}</td>
                                    <td>₹{order.total_price}</td>
                                    <td className={`status ${order.delivery_status.toLowerCase()}`}>
                                        {order.delivery_status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <button>View All Orders</button>
            </div>

        </div>
    </div>);
}
export default AdminDashboard;