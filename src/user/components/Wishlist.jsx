import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import "./css/Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    console.log(token);
    fetch("https://ecomerceback-0mx1.onrender.com/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          console.error("Unauthorized - please login again");
          setWishlist([]);
          setLoading(false);
          return null;
        }

        if (!res.ok) throw new Error("Failed to fetch wishlist");
        return res.json();
      })
      .then((data) => {
        if (data) setWishlist(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setWishlist([]);
        setLoading(false);
      });
  }, [token]);

  const removeItem = async (productId) => {


  try {
    const response = await fetch(
      `https://ecomerceback-0mx1.onrender.com/wishlist/remove/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!response.ok) throw new Error("Delete failed");

    setWishlist((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="wishlist-container">

      {wishlist.length === 0 ? (
        <p className="empty">No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div className="card" key={item.productId} 
                                >
                                  <div onClick={() => navigate(`/product/${item.productId}`)}>
              <img
                src={item.image}
                alt={item.name}
                className="product-img" 
              />

              <h3 className="name">{item.name}</h3>
              <p className="price">₹{item.price}</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeItem(item.productId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
