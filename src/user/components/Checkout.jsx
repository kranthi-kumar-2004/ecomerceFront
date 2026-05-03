import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showQty, setShowQty] = useState(false);
  const [count, setCount] = useState(1);
  const [activeProduct, setActiveProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const location = useLocation();
  const buyNowData = location.state;
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const selectedAddress = location.state?.address;
  const addressId = selectedAddress?.id;
  if (!addressId) {
    alert("Please select address");
    navigate("/address");
    return;
  }
  const calculateSavings = () =>
    cart.items.reduce((t, i) => {
      const original = i.product.price;
      const finalPrice =
        i.product.discount_price > 0
          ? i.product.discount_price
          : original;

      if (finalPrice >= original) return t;

      return t + (original - finalPrice) * i.quantity;
    }, 0);
  // 🔥 LOAD CART / BUY NOW
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {

      let items = [];

      if (buyNowData?.productId) {
        const res = await fetch(`${API}/products/${buyNowData.productId}`);
        const product = await res.json();
        items = [{ product, quantity: 1 }];
      } else {
        const res = await fetch(`${API}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        items = await Promise.all(
          data.map(async (it) => {
            const res = await fetch(`${API}/products/${it.productId}`);
            const p = await res.json();
            return { ...it, product: p };
          })
        );
      }

      setCart({ items });
      setLoading(false);
    };

    loadData();
  }, [token, buyNowData]);

  // 🔥 TOTAL
  const calculateTotal = () =>
    cart.items.reduce((t, i) => {
      const price =
        i.product.discount_price > 0
          ? i.product.discount_price
          : i.product.price;

      return t + price * i.quantity;
    }, 0);

  // 🔥 UPDATE QTY
  const updateQty = (productId, change) => {
    setCart(prev => ({
      items: prev.items.map(item => {
        if (item.product.id !== productId) return item;

        let newQty = item.quantity + change;

        if (newQty < 1) newQty = 1;
        if (newQty > item.product.stock) newQty = item.product.stock;

        return { ...item, quantity: newQty };
      })
    }));
  };

  // 🔥 LOAD RAZORPAY SCRIPT (FIX)
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔥 PLACE ORDER
  const handlePlaceOrder = async () => {

    if (cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setProcessing(true);

    try {

      const orderRes = await fetch(`${API}/api/checkout/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity
          })),
          paymentMethod,
          addressId
        }),
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        alert(text);
        return;
      }

      // 🔥 COD
      if (paymentMethod === "COD") {

        await orderRes.json();

        await fetch(`${API}/api/cart/clear`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/orders");
        return;
      }

      // 🔥 LOAD RAZORPAY SDK
      const ok = await loadRazorpay();

      if (!ok) {
        alert("Payment system failed to load");
        return;
      }

      const orderData = await orderRes.json();

      const options = {
        key: "rzp_test_ShDY79CCrlIUB2",
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.id,

        handler: async (response) => {
          await fetch(`${API}/api/checkout/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart.items.map(i => ({
                productId: i.product.id,
                quantity: i.quantity
              }))
            }),
          });

          await fetch(`${API}/api/cart/clear`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          navigate("/orders");
        },

        // 🔥 ADD THIS (VERY IMPORTANT)
        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
          }
        }
      };

      const rzp = new window.Razorpay(options);

      // 🔥 ADD THIS (PAYMENT FAILED)
      rzp.on("payment.failed", function (response) {
        alert("Payment failed ❌");
        console.log(response.error);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="ckx-container">
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => navigate(-1)} className="ckx-back">
          ← Back
        </button>
      </div>
      {selectedAddress && (
        <div className="ckx-card">
          <h3>Delivery Address</h3>

          <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
            <b>{selectedAddress.name}</b> • {selectedAddress.phone}
            <br />
            {selectedAddress.landmark}, {selectedAddress.area}, {selectedAddress.city}
            <br />
            {selectedAddress.state} - {selectedAddress.pincode}
          </div>
        </div>
      )}
      <div className="ckx-layout">

        <div className="ckx-left">
          <div className="ckx-card">
            <h2>Order Items</h2>

            {cart.items.map(item => (
              <div key={item.product.id} className="ckx-item">
                <img src={item.product.image} className="ckx-img" alt="" />

                <div>
                  <h3>{item.product.name}</h3>

                  {/* 🔥 QTY BUTTON (OPEN POPUP) */}
                  <div className="quantity">
                    <label>Qty:</label>
                    <button
                      className="qty-select"
                      onClick={() => {
                        setActiveProduct(item.product);
                        setCount(item.quantity);
                        setShowQty(true);
                      }}
                    >
                      {item.quantity} ▼
                    </button>
                  </div>
                  <p>
                    ₹{item.product.discount_price > 0
                      ? item.product.discount_price
                      : item.product.price}

                    {item.product.discount_price > 0 && (
                      <>
                        <span className="old-price">
                          ₹{item.product.price}
                        </span>
                        <span className="discount-tag">
                          {item.product.discount_percent}% OFF
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="ckx-right">
          <div className="ckx-card">
            <h3>Payment Method</h3>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              Online
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>
          </div>

          <div className="ckx-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items ({cart.items.length})</span>
              <span>₹{calculateTotal()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: "green" }}>FREE</span>
            </div>

            <hr />
            {calculateSavings() > 0 && (
              <div className="summary-row" style={{ color: "green" }}>
                <span>You Saved</span>
                <span>₹{calculateSavings()}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Order Total</span>
              <span>₹{calculateTotal()}</span>
            </div>

            <button onClick={handlePlaceOrder} className="ckx-btn">
              {processing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 SINGLE POPUP (OUTSIDE MAP) */}
      {showQty && activeProduct && (
        <div className="qty-modal">
          <div className="qty-box">

            <div className="qty-header">
              <button onClick={() => setShowQty(false)}>✖</button>
            </div>

            <div className="qty-list">
              {Array.from(
                { length: Math.min(activeProduct.stock, 20) },
                (_, i) => i + 1
              ).map((num) => (
                <div
                  key={num}
                  className={`qty-item ${count === num ? "active" : ""}`}
                  onClick={() => {
                    updateQty(activeProduct.id, num - count);
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

    </div>
  );
};

export default Checkout;