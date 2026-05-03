import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import "./css/ProductPage.css";
import Footer from "./Footer";
import Loader from "./Loader";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // 🔥 NEW STATE
  const [showQty, setShowQty] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const showToast = (message) => {
    setToast({ show: true, msg: message });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);

      } catch (err) {
        console.error(err);
        showToast("Failed to load product ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login first ⚠️");
      return;
    }

    try {
      const url = liked
        ? `${API}/wishlist/remove/${id}`
        : `${API}/wishlist/add/${id}`;

      const method = liked ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        showToast("Action failed ❌");
        return;
      }

      setLiked(!liked);
      showToast(liked ? "Removed 💔" : "Added ❤️");

    } catch (err) {
      showToast("Server error ❌");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login first ⚠️");
      return;
    }

    try {
      setAdding(true);

      const res = await fetch(API + "/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(id),
          quantity: count,
        }),
      });

      if (!res.ok) {
        showToast("Error ❌");
        return;
      }

      showToast("Cart updated ✅");

    } catch {
      showToast("Server error ❌");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="pp">
      <button className="back-bt" onClick={() => navigate(-1)}>←</button>

      <div className="product-container">
        {product && (
          <>
            <div className="product-image">
              <img src={product.image} alt={product.name} />

              <div
                className={`wishlist ${liked ? "active" : ""}`}
                onClick={handleWishlistToggle}
              >
                <FaHeart />
              </div>
            </div>

            <div className="product-details">
              <h2>{product.name}</h2>
               <p className="det">{product.description}</p>
              <p className="price">
                {product.stock === 0 ? (
                  <span className="out-stock">Out of Stock</span>
                ) : (
                  <>
                    ₹{product.discount_price}{" "}
                    <span className="old-price">₹{product.price}</span>
                    <span className="discount">{product.discount_percent}% OFF</span>
                  </>
                )}
              </p>

              {/* 🔥 STOCK MESSAGE */}
              {product.stock > 0 && product.stock <= 3 && (
                <p className="low-stock">
                  Only {product.stock} left
                </p>
              )}

              {/* 🔥 QTY BUTTON */}
              <button
                className="qty-select"
                onClick={() => product.stock > 0 && setShowQty(true)}
                disabled={product.stock === 0}
              >
                <label>Qty:</label>
                {product.stock === 0 ? "" : `${count} ▼`}
              </button>

              <div className="buttons">
                <button
                  className="car"
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>

                {/* 🔥 BUY NOW FIX */}
                <button
                  className="buy"
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (product.stock === 0) return;

                    const token = localStorage.getItem("token");

                    if (!token) {
                      showToast("Please login first ⚠️");
                      return;
                    }

                    navigate("/address", {
                      state: {
                        productId: product.id,
                        quantity: count
                      }
                    });
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🔥 QTY POPUP */}
      {showQty && (
        <div className="qty-modal">
          <div className="qty-box">

            <div className="qty-header">
              <button onClick={() => setShowQty(false)}>✖</button>
            </div>

            <div className="qty-list">
              {Array.from(
                { length: Math.min(product.stock, 20) },
                (_, i) => i + 1
              ).map((num) => (
                <div
                  key={num}
                  className={`qty-item ${count === num ? "active" : ""}`}
                  onClick={() => {
                    setCount(num);
                    setShowQty(false);
                  }}
                >
                  {num}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {toast.show && (
        <div className="toast">
          <span>{toast.msg}</span>
          <button onClick={() => setToast({ show: false, msg: "" })}>
            ✖
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProductPage;