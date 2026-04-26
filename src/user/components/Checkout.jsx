import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./css/Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const buyNowData = location.state;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
  };
  const [addressData, setAddressData] = useState({
    phone: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    pincode: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ IF BUY NOW (state exists)
    if (buyNowData && buyNowData.productId) {

      fetch(`https://ecomerceback-0mx1.onrender.com/products/${buyNowData.productId}`)
        .then(res => res.json())
        .then(product => {
          setCart({
            items: [{
              product,
              quantity: buyNowData.quantity || 1
            }]
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));

    } else {
      // ✅ NORMAL CART FLOW

      fetch("https://ecomerceback-0mx1.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(async (data) => {
          const updated = await Promise.all(
            data.map(async (it) => {
              const res = await fetch(`https://ecomerceback-0mx1.onrender.com/products/${it.productId}`);
              const p = await res.json();

              return {
                ...it,
                product: p,
              };
            })
          );

          setCart({ items: updated });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    // ✅ ADDRESS LOAD (same for both)
    fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/address", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      });

  }, [token, buyNowData]);

  const calculateTotal = () =>
    cart.items.reduce((t, i) => t + i.product.price * i.quantity, 0);

  const saveAddress = async () => {

  // 🔴 VALIDATION
  if (
    !addressData.phone ||
    !addressData.landmark ||
    !addressData.area ||
    !addressData.city ||
    !addressData.state ||
    !addressData.pincode
  ) {
    showToast("All fields are required ❌", "error");
    return;
  }

  // 🔴 PHONE VALIDATION
  if (addressData.phone.length !== 10) {
    showToast("Enter valid 10-digit phone ❌", "error");
    return;
  }

  // 🔴 PINCODE VALIDATION
  if (addressData.pincode.length !== 6) {
    showToast("Enter valid 6-digit pincode ❌", "error");
    return;
  }

  try {
    await fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    showToast("Address Saved ✅");
    setShowForm(false);
    window.location.reload();

  } catch {
    showToast("Failed ❌", "error");
  }
};

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Select address");
    if (cart.items.length === 0) return alert("Cart empty");

    setProcessing(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed");
        setProcessing(false);
        return;
      }

      const orderRes = await fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotal()
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        showToast("Order creation failed", "error");
        setProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_ShDY79CCrlIUB2", // keep as is (you can switch later)
        amount: orderData.amount,
        currency: "INR",
        name: "My Store",
        order_id: orderData.id,

        // ✅ UPDATED HANDLER (WITH VERIFICATION)
        handler: async function (response) {
          try {
            // 🔐 STEP 1: Verify payment
            const verifyRes = await fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              alert("❌ Payment verification failed");
              return;
            }

            // ✅ STEP 2: Place order AFTER verification
            await fetch("https://ecomerceback-0mx1.onrender.com/api/checkout/order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: cart.items.map(i => ({
                  productId: i.product.id,
                  quantity: i.quantity
                })),
                totalPrice: calculateTotal(),
                paymentMethod: "ONLINE",
                paymentId: response.razorpay_payment_id, // ✅ added
                addressId: selectedAddress.id
              }),
            });

            // ✅ STEP 3: Clear cart
            await fetch("https://ecomerceback-0mx1.onrender.com/api/cart/clear", {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });


           navigate("/orders", { state: { success: true } });

          } catch (err) {
            console.error(err);
            alert("Post-payment error ❌");
          }
        },

        // ✅ HANDLE PAYMENT CANCEL
        modal: {
          ondismiss: function () {
            showToast("Payment cancelled ❌");

          }
        }
      };

      const rzp = new window.Razorpay(options);

      // ✅ HANDLE PAYMENT FAILURE
      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("❌ Payment failed");
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("❌ Error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="ckx-container">
      <div className="ckx-layout">

        <div className="ckx-left">

          <div className="ckx-card">
            <div className="ckx-address-header">
              <h2>Delivery Address</h2>
              <button className="ckx-add-btn" onClick={() => setShowForm(true)}>
                + Add Address
              </button>
            </div>

            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`ckx-address-box ${selectedAddress?.id === addr.id ? "active" : ""}`}
                onClick={() => setSelectedAddress(addr)}
              >
                <input
                  type="radio"
                  checked={selectedAddress?.id === addr.id}
                  onChange={() => setSelectedAddress(addr)}
                />

                <div>
                  <p>{addr.area}, {addr.landmark}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p>📞 {addr.phone}</p>
                </div>
              </div>
            ))}

            {showForm && (
              <div className="ckx-address-form">

                <div className="ckx-grid-2">
                  <input name="phone" placeholder="Phone" onChange={handleChange} />
                  <input name="landmark" placeholder="Landmark" onChange={handleChange} />
                </div>
                <input name="area" placeholder="Area" onChange={handleChange} />
                <div className="ckx-grid-3">
                  <input name="city" placeholder="City" onChange={handleChange} />
                  <input name="state" placeholder="State" onChange={handleChange} />
                  <input name="pincode" placeholder="Pincode" onChange={handleChange} />
                </div>

                <div className="ckx-btn-row">
                  <button className="ckx-save-btn" onClick={saveAddress}>
                    Save Address
                  </button>

                  <button
                    className="ckx-cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}
          </div>

          <div className="ckx-card">
            <h2>Order Items</h2>

            {cart.items.map(item => (
              <div key={item.product.id} className="ckx-item">
                <img src={item.product.image} className="ckx-img" alt="" />
                <div>
                  <h3>{item.product.name}</h3>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.product.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="ckx-right">
          <div className="ckx-summary">
            <h2>Order Summary</h2>

            {cart.items.map(item => (
              <div className="ckx-row" key={item.product.id}>
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <hr />

            <div className="ckx-row ckx-total">
              <span>Subtotal</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>

            <button onClick={handlePlaceOrder} className="ckx-btn">
              {processing ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </div>

      </div>
      {toast.show && (
        <div className={`ckx-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Checkout;
