import { useState, useEffect } from "react";
import{Link,useNavigate} from "react-router-dom"
import Register from "./Register";
import "./css/Login.css";

function Login({ close ,openRegister}) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = (e) => {
  e.preventDefault();

  fetch("https://ecomerceback-0mx1.onrender.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      return res.json();
    })
    .then((data) => {
      setError("");
      setSuccess("Login successful!");

      localStorage.setItem("token", data.token);

      setTimeout(() => {
        close();  
        
        
      }, 1000); 
    })
    .catch(() => {
      setError("Invalid email or password");
      setSuccess("");
    });
};

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <span className="close-btn" onClick={close}>
          &times;
        </span>

        <h2>Login</h2>

        {error && <p className="error">{error}</p>}
        {success&&<p className="success">{success}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have account?{" "}
         <span
         style={{ cursor: "pointer", color: "blue" }}
           onClick={openRegister}
            >
         Register
         </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
