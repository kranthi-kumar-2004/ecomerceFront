import "./css/Header.css";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import Orders from "./Orders";

function Header() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchText, setSearchText] = useState("");

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔍 Search handler
  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search?q=${searchText}`);
  };

  // 🔍 Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <header>
        {/* 🔥 Logo */}
        <Link to="/" className="logo">
          Smart Store
        </Link>

        {/* 🔍 Search */}
        <div className="search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>

        {/* 🔥 Menu */}
        <div className="menu-bar" ref={menuRef}>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>

          <FaBars
            className="menu"
            onClick={() => setOpen(!open)}
          />

          {/* 🔽 Dropdown */}
         {open && (
  <div className="dropdown-menu">
    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
    <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>

    {token ? (
      <>
        <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
        <Link to="/whishlist" onClick={() => setOpen(false)}>Wishlist</Link>
        <Link
          onClick={() => {
            handleLogout();
            setOpen(false);
          }}
        >
          Logout
        </Link>
      </>
    ) : (
      <Link
        onClick={() => {
          setShowLogin(true);
          setOpen(false);
        }}
      >
        Login
      </Link>
    )}
  </div>
)}
        </div>
      </header>

      {/* 🔐 Login Modal */}
      {showLogin && (
        <Login
          close={() => setShowLogin(false)}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* 📝 Register Modal */}
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
