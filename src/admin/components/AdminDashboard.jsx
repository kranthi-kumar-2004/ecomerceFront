import "./css/Dashboard.css";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import{FaUsers,FaShoppingCart,FaRupeeSign,FaBoxOpen} from "react-icons/fa";
function AdminDashboard(){
    const [users,setUsers]=useState(0);
    const[products,setProducts]=useState(0);
    const[totalO,setTotalO]=useState(0);
    const[revenue,setRevenue]=useState(0);
        useEffect(() => {
        fetchDashboardData();
        const interval=setInterval(()=>{
            fetchDashboardData();
        },3000);
        return()=>clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
        const res = await fetch("http://localhost:8080/api/dashboard");
        const data= await res.json();
        console.log(data);
        setUsers(data.users);
        setProducts(data.products);

        } catch (error) {
        console.error("Error fetching dashboard data:", error);
        }
    };
    return(<div className="dash">
        <h2>Admin Dashboard</h2>
    <div className="display-content" >
        <div className="box"> 
            <div className="inbox">
                 <h5>Total Users</h5>
                 <span>{users}</span>
            </div>
            <FaUsers className="icon-users"/> 
        </div>
        <div className="box">
            <div className="inbox">
                <h5>Total Products</h5>
                <span>{products}</span>
            </div>
            <FaBoxOpen className="icon-products"/>
            
        </div>
        <div className="box">
            <div className="inbox">
                <h5>Total Orders</h5>
                <span>{totalO}</span>
            </div>
            <FaShoppingCart className="icon-orders"/>
        </div>
        <div className="box">
            <div className="inbox">
                <h5>Total Revenue</h5>
                <span>{revenue}</span>
            </div>
            <FaRupeeSign className="icon-revenue"/>
        </div>
    </div>
    <div className="RQ">
        <div className="Quick">
            <h4>Quick Actions</h4>
            <Link className="manage-p" to="/admin/manage">Manage Product</Link>
            <Link to="/admin/manage">Manage Orders</Link>
            <Link to="/admin/manage">Manage Users</Link>
            <Link to="/admin/manage">Manage Staff</Link>
        </div>
        <div className="Recent">
            <h4>Recent Orders</h4>
            <label htmlFor="">No recent Orders</label>
            <button>View All Orders</button>
        </div>
        
    </div>
    </div>);
}
export default AdminDashboard;