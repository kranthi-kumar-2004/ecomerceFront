import { Link } from "react-router-dom";
import{useState} from "react";
import {FaSearch,FaBell,FaBars} from "react-icons/fa";
import "./css/AdminHeader.css";
function AdminHeader(){
    const [open,setOpen]=useState(false);
    return(
        <header>
            <img src="" alt="" />
            <div className="search">
                <input type="text" placeholder="Search here...." />
                <FaSearch className="search-icon"/>
            </div>
            <FaBell className="notification"/>
            <FaBars className="menu_a"
            onClick={()=>setOpen(!open)}
            />
            {open&&(<div className="dropdown-menu">
                <Link>My Profile</Link>
                <Link>Setting</Link>
                <Link>Logout</Link>
            </div>)}
        </header>
    );
}
export default AdminHeader;