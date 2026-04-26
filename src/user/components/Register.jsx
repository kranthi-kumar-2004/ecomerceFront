import { useState } from "react";
import "./css/Register.css";

function Register({ close, openLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 👁 first password visible toggle
  const [showPassword, setShowPassword] = useState(true);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = (e) => {
    e.preventDefault();

    // 🔴 Name validation
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      setSuccess("");
      return;
    }

    // 🔴 Email validation
    if (!validateEmail(email)) {
      setError("Invalid email format");
      setSuccess("");
      return;
    }

    // 🔴 Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    // 🔴 Match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    // ✅ API call
    fetch("https://ecomerceback-0mx1.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
    name: name,
    email: email,   // ✅ important
    password: password
  }),
    })
      .then(async (res) => {
        const message = await res.text();

        if (res.ok) {
          setError("");
          setSuccess("Registration successful!");

          setTimeout(() => {
            close();
            openLogin();
          }, 1500);
        } else {
          setSuccess("");
          setError(message);
        }
      })
      .catch(() => {
        setError("Something went wrong");
        setSuccess("");
      });
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleRegister}>
        <span className="close-btn" onClick={close}>
          &times;
        </span>

        <h2>Register</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* Name */}
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password (VISIBLE FIRST) */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => setShowPassword(showPassword)}
          >

          </span>
        </div>

        {/* Confirm Password (ALWAYS HIDDEN) */}
        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have account?
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={openLogin}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
