import { Link } from "react-router-dom";
import{useState} from "react";
import {FaSearch,FaBell,FaBars} from "react-icons/fa";
import "./css/AdminHeader.css";
function AdminHeader(){
    const [open,setOpen]=useState(false);
    return(
        <header className="user_header">
              <Link to="/" className="logo">
    Smart Store
  </Link>
            <div className="user_search">
                <input type="text" placeholder="Search here...." />
                <FaSearch className="search-icon"/>
            </div>
            <FaBell className="notification"/>
            <FaBars className="user_menu"
            onClick={()=>setOpen(!open)}
            />
            {open&&(<div className="user_dropdown-menu">
                <Link>My Profile</Link>
                <Link>Setting</Link>
                <Link>Logout</Link>
            </div>)}
        </header>
    );
}
export default AdminHeader;