import "./css/Header.css";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";

function Header() {
  const[login,setLogin]=useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const token=localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  document.addEventListener("click", handleClickOutside);

  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  return (
    <>
    <header>
      <img src="" alt="" />

      <div className="search">
        <input type="text" placeholder="Search here" />
        <FaSearch className="search-icon" />
      </div>

      <div className="menu-bar" ref={menuRef}>
        <a href="/">Home</a>
        <Link to="/cart">Cart</Link>
        
        <FaBars
          className="menu"
          onClick={() => setOpen(!open)}
        />
      </div>
      <div>
        {open && token &&(
          <div className="dropdown-menu">
            <Link to="/">Home</Link>
            <Link>Profile</Link>
            <Link to="/cart">Cart</Link>
            <Link>Orders</Link>
            <Link>whish List</Link>
            <Link onClick={handleLogout}>Logout</Link>
          </div>

        )}
      </div>
      <div>
         {open && !token && (
          <div className="dropdown-menu">
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link onClick={()=>setShowLogin(true)}>Login</Link>
          </div>
        )}
      </div>
    </header>
    {showLogin && (
  <Login
    close={() => setShowLogin(false)}
    openRegister={() => {
      setShowLogin(false);
      setShowRegister(true);
    }}
  />
)}

{showRegister && (
  <Register
    close={() => setShowRegister(false)}
    openLogin={() => {
      setShowRegister(false);
      setShowLogin(true);
    }}
  />
)}
    </>
  );
}
export default Header;
