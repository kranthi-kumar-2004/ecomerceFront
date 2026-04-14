import "./css/Cart.css";
import Footer from "./Footer";
import { useEffect, useState } from "react";

function Cart() {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoad(false);
      return;
    }

    fetch("https://ecomerceback-0mx1.onrender.com/api/cart", {
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
            const res = await fetch(
              `https://ecomerceback-0mx1.onrender.com/products/${it.productId}`
            );
            if (!res.ok) return it;

            const p = await res.json();

            return {
              ...it,
              name: p.name,
              price: p.price,
              image: p.image,
              category: p.category,
              description: p.description,
            };
          })
        );

        setItems(updated);
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }, [token]);

  const qty = (it, t) => {
    const q = t === "inc" ? it.quantity + 1 : Math.max(1, it.quantity - 1);

    fetch("http://localhost:8080/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: it.productId,
        quantity: q,
      }),
    }).then(() => {
      setItems((p) =>
        p.map((i) => (i.id === it.id ? { ...i, quantity: q } : i))
      );
    });
  };

  const del = (it) => {
    fetch(`http://localhost:8080/api/cart/${it.productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setItems((p) => p.filter((i) => i.id !== it.id));
    });
  };

  const sub = items.reduce(
    (a, i) => a + i.price * i.quantity,
    0
  );

  if (load) return <h2>Loading...</h2>;

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
          <div className="ci">
            {items.map((it) => (
              <div className="cd" key={it.id}>
                <img src={it.image} alt="" className="img" />

                <div className="pd">
                  <h3>{it.name}</h3>
                  <p>{it.category}</p>
                  <p className="ds">{it.description}</p>
                  <h4>₹{it.price.toLocaleString()}</h4>
                </div>

                <div className="qt">
                  <button onClick={() => qty(it, "dec")}>-</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => qty(it, "inc")}>+</button>
                  <div className="dl" onClick={() => del(it)}>🗑️</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sm">
            <h2>Order Summary</h2>

            <div className="rw">
              <span>Subtotal</span>
              <span>₹{sub.toLocaleString()}</span>
            </div>

            <div className="rw">
              <span>Shipping</span>
              <span className="fr">FREE</span>
            </div>

            <hr />

            <div className="rw tt">
              <span>Total</span>
              <span>₹{sub.toLocaleString()}</span>
            </div>

            <button className="cb">Proceed to Checkout</button>
            <p className="cn">Continue Shopping</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cart;
