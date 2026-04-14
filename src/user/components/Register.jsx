import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/Register.css";

function Register({close,openLogin}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleRegister = (e) => {
  e.preventDefault();

  fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then(async (res) => {
      const message = await res.text();

      if (res.ok) {
        setError("");
        setSuccess("Registration successful! Redirecting...");

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
        <form className="register-card"onSubmit={handleRegister}>
            <span className="close-btn" onClick={close}>
                &times;
            </span>
            <h2>Register</h2>
           {error && <p className="error">{error}</p>}
           {success&&<p className="success">{success}</p>}
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
