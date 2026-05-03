import { useEffect, useState } from "react";
import "./css/Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 🔥 Fetch USER DATA
    fetch(API+"/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    // 🔥 Fetch ADDRESSES
    fetch(API+"/api/checkout/address", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setAddresses(data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="profile-container">

      <h1 className="profile-title">My Profile</h1>

      {     }
    <div className="profile-card">
  <div className="profile-left">

    {/* LEFT SIDE */}
    <div className="profile-info">
      <div className="avatar">
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </div>

      <div>
        <h2>{user.name}</h2>
        <p className="email">{user.username}</p>
        <span className="badge">user</span>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <button className="edit-btn">Edit Profile</button>

  </div>
</div>
      <div className="address-card">
        <div className="address-header">
          <h2>Saved Addresses</h2>
          <button className="add-btn">+ Add Address</button>
        </div>

        {addresses.length === 0 ? (
          <p>No addresses found</p>
        ) : (
          addresses.map((addr, index) => (
            <div key={index} className="address-box">
              <h3>{addr.name}</h3>
              <p>{addr.phone}</p>
              <p>
                {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="address-actions">
                <button className="edit">Edit</button>
                <button className="delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Profile;