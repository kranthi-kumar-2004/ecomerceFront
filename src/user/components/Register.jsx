import { useState } from "react";
import "./css/Register.css";

function Register({ close, openLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 👁 toggle (default hidden)
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = (e) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      setSuccess("");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      setSuccess("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    fetch(API+"/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(async (res) => {
        const message = await res.text();

        if (res.ok) {
          setError("");
          setSuccess("Registration successful!");

          setTimeout(() => {
            close();
            openLogin();
          }, 1200);
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

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD FIELD */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"} // ✅ fixed
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have account?{" "}
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