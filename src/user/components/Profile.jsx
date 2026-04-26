import { useEffect, useState } from "react";
import "./css/Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // 🔥 Fetch USER DATA
    fetch("https://ecomerceback-0mx1.onrender.com/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    // 🔥 Fetch ADDRESSES
    fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/address", {
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

      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-left">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p className="email">{user.username}</p>
            <span className="badge">user</span>
          </div>
        </div>

        <button className="edit-btn">Edit Profile</button>

        <div className="profile-details">
          <div>
            <p className="label">Name</p>
            <p>{user.name}</p>
          </div>

          <div>
            <p className="label">Email</p>
            <p>{user.username}</p>
          </div>
        </div>
      </div>

      {/* ADDRESS SECTION */}
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
