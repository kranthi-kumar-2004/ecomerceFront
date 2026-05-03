import "./css/Cart.css";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const API = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);
  const [showQty, setShowQty] = useState(null);
  const savings = items.reduce(
    (a, i) =>
      i.stock === 0
        ? a
        : a +
        (i.discount_percent > 0
          ? (i.price - i.discount_price) * i.quantity
          : 0),
    0
  );
  const token = localStorage.getItem("token");
  useEffect(() => {
    const close = () => setShowQty(null);
    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);
  // 🔥 LOAD CART + PRODUCT DETAILS
  useEffect(() => {
    if (!token) {
      setLoad(false);
      return;
    }

    fetch(`${API}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(async (data) => {
        const updated = await Promise.all(
          data.map(async (it) => {
            const res = await fetch(`${API}/products/${it.productId}`);
            if (!res.ok) return it;

            const p = await res.json();

            return {
              ...it,
              name: p.name,
              price: p.price,
              discount_price: p.discount_price,
              discount_percent: p.discount_percent,
              image: p.image,
              category: p.category,
              description: p.description,
              stock: p.stock || 0,
            };
          })
        );

        setItems(updated);
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }, [token]);

  // 🔥 QUANTITY CONTROL WITH STOCK LIMIT
  const qty = (it, value) => {

    let newQty =
      typeof value === "number"
        ? value
        : value === "inc"
          ? it.quantity + 1
          : it.quantity - 1;

    if (newQty < 1) newQty = 1;

    if (it.stock && newQty > it.stock) {
      alert(`Only ${it.stock} items available`);
      return;
    }

    fetch(`${API}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: it.productId,
        quantity: newQty,
      }),
    }).then(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === it.id ? { ...i, quantity: newQty } : i
        )
      );
    });
  };

  // 🔥 DELETE ITEM
  const del = (it) => {
    fetch(`${API}/api/cart/${it.productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setItems((prev) => prev.filter((i) => i.id !== it.id));
    });
  };
  const hasOutOfStock = items.some((i) => i.stock === 0);
  // 🔥 TOTAL
  const sub = items.reduce(
    (a, i) =>
      i.stock === 0
        ? a
        : a +
        (i.discount_price > 0 ? i.discount_price : i.price) *
        i.quantity,
    0
  );
  const getPrice = (i) =>
    i.discount_price > 0 ? i.discount_price : i.price;
  if (load) return <h2>Loading...</h2>;

  // 🔥 EMPTY CART
  if (items.length === 0)
    return (
      <>
        <div className="c">
          <h2 className="e">Your cart is empty 🛒</h2>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <div className="ct">
        <h1>Shopping Cart</h1>

        <div className="cc">
          {/* LEFT */}
          <div className="ci">
            {items.map((it) => (
              <div className="cd" key={it.id}>
                <img src={it.image} alt="" className="img" />

                <div className="pd">
                  <h3>{it.name}</h3>
                  <p>{it.category}</p>
                  <p className="ds">{it.description}</p>
                  {it.stock === 0 ? (
                    <h4 className="out-stock">Out of Stock</h4>
                  ) : (
                    <h4>
                      ₹{(it.discount_price > 0 ? it.discount_price : it.price).toLocaleString()}

                      {it.discount_percent > 0 && (
                        <>
                          <span className="old-price">
                            ₹{it.price.toLocaleString()}
                          </span>
                          <span className="discount-tag">
                            {it.discount_percent}% OFF
                          </span>
                        </>
                      )}
                    </h4>
                  )}

                  {/* OPTIONAL STOCK MESSAGE */}
                  {it.stock && it.quantity >= it.stock && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      Only {it.stock} left
                    </p>
                  )}
                </div>
                <div className="qt">

                  {it.stock === 0 ? (
                    <span className="out-stock">Out of Stock</span>
                  ) : (
                    <>
                      <label>Qty:</label>

                      {/* CURRENT SELECTED */}
                      <div
                        className="qty-box"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQty(prev => prev === it.id ? null : it.id);
                        }}
                      >
                        {it.quantity} ▼
                      </div>

                      {/* DROPDOWN */}
                      {showQty === it.id && (
                        <div className="qty-modal" onClick={() => setShowQty(null)}>
                          <div
                            className="qty-box"
                            onClick={(e) => e.stopPropagation()}
                          >

                            {/* CLOSE BUTTON */}
                            <div className="qty-header">
                              <button onClick={() => setShowQty(null)}>✖</button>
                            </div>

                            {/* LIST */}
                            <div className="qty-list">
                              {Array.from(
                                { length: Math.min(it.stock, 20) },
                                (_, i) => i + 1
                              ).map((num) => (
                                <div
                                  key={num}
                                  className={`qty-item ${it.quantity === num ? "active" : ""}`}
                                  onClick={() => {
                                    qty(it, num);
                                    setShowQty(null);
                                  }}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>

                          </div>

                        </div>
                      )}
                    </>
                  )}

                  <div className="dl" onClick={() => del(it)}>🗑️</div>

                </div>
              </div>

            ))}

          </div>

          {/* RIGHT */}
          <div className="sm">
            <h2>Order Summary</h2>

            {/* ITEMS */}
            {items.map((it) => (
              <div className="rw" key={it.id}>
                <span>
                  {it.name} × {it.quantity}
                </span>

                <span>
                  {it.stock === 0
                    ? "Out of Stock"
                    : `₹${(getPrice(it) * it.quantity).toLocaleString()}`}
                </span>
              </div>
            ))}

            <hr />

            {/* SAVINGS */}
            {savings > 0 && (
              <div className="rw" style={{ color: "green" }}>
                <span>You Saved</span>
                <span>₹{savings.toLocaleString()}</span>
              </div>
            )}

            {/* SUBTOTAL */}
            <div className="rw tt">
              <span>Subtotal</span>
              <span>₹{sub.toLocaleString()}</span>
            </div>

            {/* BUTTONS */}
            <Link
              to={hasOutOfStock ? "#" : "/address"}
              className={`cn ${hasOutOfStock ? "disabled-btn" : ""}`}
              onClick={(e) => {
                if (hasOutOfStock) {
                  e.preventDefault(); // 🚫 block navigation
                }
              }}
            >
              Checkout products
            </Link>

            <Link to="/" className="cn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
}

export default Cart;