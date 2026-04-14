import { useParams, useNavigate } from "react-router-dom";
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

  const showToast = (message) => {
  setToast({ show: true, msg: message });

  setTimeout(() => {
    setToast({ show: false, msg: "" });
  }, 3000);
   };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://ecomerceback-0mx1.onrender.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        console.log("PRODUCT:", data);

        setProduct(data);

      } catch (err) {
        console.error("❌ Product fetch error:", err);
        showToast("Failed to load product ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please login first ⚠️");
    return;
  }

  try {
    setAdding(true);

    const finalId = Number(id);

    console.log("FINAL ID SENT:", finalId);

    const res = await fetch("https://ecomerceback-0mx1.onrender.com/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: finalId, 
        quantity: count,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      alert(`Error: ${errorData?.error || "Something went wrong ❌"}`);
      return;
    }

    const data = await res.json();
    console.log("Response:", data);

    showToast("Cart updated ✅");

  } catch (err) {
    console.error("❌ Network error:", err);
    showToast("Server not reachable ❌");
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
                onClick={() => setLiked(!liked)}
              >
                <FaHeart />
              </div>
            </div>

            <div className="product-details">
              <h2>{product.name}</h2>
              <p className="det">{product.description}</p>
              <h3>₹{product.price.toLocaleString()}</h3>
              {product.stock === 0 ? (
                <p className="out-stock">Out of Stock ❌</p>
              ) : product.stock <= 3 ? (
                <p className="stock-low">{product.stock} left ⚠️</p>
              ) : (
                <p className="stock-ok">In Stock </p>
              )}

              <div className="quantity">
                <button
                  onClick={() =>
                    setCount((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  -
                </button>

                <span>{count}</span>

                <button
                  onClick={() => setCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

             <div className="buttons">
              {product.stock === 0 ? (
                <button className="buy">Notify Me 🔔</button>
              ) : (
                <>
                  <button
                    className="car"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button className="buy">Buy Now</button>
                </>
              )}
            </div>
            </div>
          </>
        )}
      </div>
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
