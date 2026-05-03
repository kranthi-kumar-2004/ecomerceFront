import { NavLink } from "react-router-dom";
import "./css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {     }
        <div className="footer-section">
          <h3 className="footer-logo">SmartCart</h3>
          <p className="footer-desc">
            A modern full-stack e-commerce platform designed for
            secure shopping, real-time cart management, and seamless
            user experience.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@smartcart.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 SmartCart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
